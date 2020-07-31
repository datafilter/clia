module.exports = async ({ test, assert, affirm, alike }) => {

    const cli = require('../index')

    const throws = (f) => {
        const not_thrown = {}
        try {
            f()
            throw not_thrown
        } catch (err) {
            if (err === not_thrown)
                throw Error("didn't throw error as expected")
            else return err
        }
    }

    const test_err = (description, f, maybe_check = i => i) => test(description, () => {
        const err = throws(f)
        maybe_check(err)
    })

    return [
        test_err("doesn't allow prototype pollution", () => {
            cli([, , '__proto__'])
        })
        , test_err("multiple unflagged args throws error", () => {
            cli(['one', 'two'])
        })
        , test("no args return empty object", () => {
            alike({}, cli())
        })
        , test("single unflagged arg set in clia property", () => {
            const single = cli(['there'])
            alike({ clia: 'there' }, single)
        })
        , test("letter flag option sets boolean", () => {
            alike({ v: true }, cli(['-v']))
            alike({ v: true, w: true }, cli(['-vw']))
            alike({ a: true, b: true, c: true }, cli(['-ab', '-b', '-c']))
            alike({ a: true, '-': true, '_': true }, cli(['-a-_']))
            alike({ v: true, s: true, clia: 'bacccon' }, cli(['-v', 'bacccon', '-s']))
        })
        , test_err("empty dash throws error", () => {
            cli(['-'])
        })
        , test_err("empty double dash throws error", () => {
            // TODO posix/gnu behaviour here intead.
            cli(['--'])
        })
        , test("word flag sets boolean", () => {
            alike({ verbose: true }, cli(['--verbose']))
            alike({ apple: true, banana: true, c: true, d: true }, cli(['--banana','--apple','--c','-d']))
        })

    ]
}