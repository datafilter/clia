module.exports = async ({ test }) => {

    const clia = require('../index')

    const cli = (text) => text && clia(text.split(' ')) || clia(text)

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
            cli('__proto__')
        })
        , test_err("checks even when skipping parsing", () => {
            cli('throw even after -- verbatim operator __proto__')
        })
        , test_err("empty key key-value throws error", () => {
            cli('--=val')
        })
        , test_err("empty value key-value throws error", () => {
            cli('--opt=')
        })
    ]
}