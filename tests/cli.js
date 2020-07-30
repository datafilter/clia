module.exports = async ({ test, assert, affirm, alike }) => {

    const cli = require('../index')

    return [
        test("doesn't allow prototype pollution", () => {
            const not_thrown = {}
            try {
                cli([, , '__proto__'])
                throw not_thrown
            } catch (err) {
                if (err === not_thrown)
                    throw Error("didn't throw error as expected")
            }
        })

        , test("assert compares values with ===", () => {
            const five = 2 + 3
            assert(5, five)
        })
    ]
}