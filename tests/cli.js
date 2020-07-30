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
        , test("single unflagged arg set in _ property", () => {
            const single = cli(['there'])
            alike({ '_': 'there' }, single)
        })
        
    ]
}