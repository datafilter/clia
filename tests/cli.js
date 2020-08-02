module.exports = async ({ test, assert, affirm, alike }) => {

    const cli = require('../index')

    const throws = (f) => {
        const not_thrown = {}
        try {
            f()
            throw not_thrown
        } catch (err) {
            if (err === not_thrown)
                throw Error("did not throw expected error")
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
        , test("no args return empty object", () => {
            alike(cli(), { $$: [] })
            alike(cli([, , ,]), { $$: [] })
        })
        , test("single unflagged arg set in $$ property", () => {
            alike(cli(['there']), { $$: ['there'] })
        })
        , test("multiple unflagged args set in $$ property", () => {
            alike(cli(['one', 'two', 'three']), { $$: ['one', 'two', 'three'] })
        })
        , test("letter flag option sets boolean", () => {
            alike(cli(['-v']), { $$: [], v: true })
            alike(cli(['-vw']), { $$: [], v: true, w: true })
            alike(cli(['-ab', '-b', '-c']), { $$: [], a: true, b: true, c: true })
            alike(cli(['-a-_']), { $$: [], a: true, '-': true, '_': true })
            alike(cli(['-v', 'lemon', '-s']), { $$: ['lemon'], v: true, s: true })
        })
        , test_err("empty dash throws error", () => {
            cli(['-'])
        })
        , test_err("empty double dash throws error", () => {
            // TODO posix/gnu behaviour here intead.
            cli(['--'])
        })
        , test("word flag sets boolean", () => {
            alike(cli(['--verbose']), { $$: [], verbose: true })
            alike(cli(['--banana', '--apple', '--c', '-d']), { $$: [], apple: true, banana: true, c: true, d: true })
        })
        , test_err("empty key with word flag throws error", () => {
            cli(['--=val'])
        })
        , test_err("empty value with word flag throws error", () => {
            cli(['--opt='])
        })
        , test("word flag with equals sets string", () => {
            alike(cli(['--opt=some']), { $$: [], opt: 'some' })
        })
        , test("last option/flag overrides previous options/flags", () => {
            alike(cli(['--rover=some', '--rover']), { $$: [], rover: true })
            alike(cli(['--rover', '--rover=mars']), { $$: [], rover: 'mars' })
        })

    ]
}