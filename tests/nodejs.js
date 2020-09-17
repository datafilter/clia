module.exports = async ({ test, equal }) => {

    const { execSync } = require("child_process")
    const shell = (cmd) => execSync(cmd) + ''

    const test_app = `console.log(process.argv.slice(2))`
    const has_empty = (input) => shell(`node -e "${test_app}" ${input}`)

    const json_quotes = s => s.includes(`'`) ? json_quotes(s.replace(`'`, `"`)) : s

    return [
        test("process.argv only has non-empty strings", () => {
            const sparse = has_empty('some tokens and s p a c e s')
            const distant = has_empty('some tokens           and      s p  a   c   e    s')

            equal(sparse, distant)

            const rebuilt_input = JSON.parse(json_quotes(`{ "$": ${sparse}}`)).$

            equal(rebuilt_input, ['tokens', 'and', 's', 'p', 'a', 'c', 'e', 's'])
        })
    ]
}