module.exports = async ({ test, alike }) => {

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
        , test("no args return empty object", () => {
            alike(cli(), { $$: [] })
        })
        , test("single unflagged arg set in $$ property", () => {
            alike(cli('there'), { $$: ['there'] })
            alike(cli('$'), { $$: ['$'] })
        })
        , test("multiple unflagged args set in $$ property", () => {
            alike(cli('one two three $four $$five $$$ix'),
                { $$: ['one', 'two', 'three', '$four', '$$five', '$$$ix'] })
        })
        , test("letter flag can start with -$", () => {
            alike(cli('-$'), { $$: {}, $: true })
            alike(cli('-$ab'), { $$: {}, $: true, a: true, b: true })
        })
        , test("word flag can start with --$", () => {
            alike(cli('--$'), { $$: {}, $: true })
            alike(cli('--$a'), { $$: {}, $a: true })
        })
        , test("letter flag option sets boolean", () => {
            alike(cli('-v'), { $$: [], v: true })
            alike(cli('-vw'), { $$: [], v: true, w: true })
            alike(cli('-ab -b -c'), { $$: [], a: true, b: true, c: true })
            alike(cli('-a-_'), { $$: [], a: true, '-': true, '_': true })
            alike(cli('-v lemon -s'), {
                $$: ['lemon'],
                $v: ['lemon'],
                v: true, s: true
            })
        })
        , test("single dash is argument", () => {
            alike(cli('-'), { $$: ['-'] })
        })
        , test("1st double dash is ignored ", () => {
            alike(cli('--'), { $$: [] })
        })
        , test("arguments after -- are parsed verbatim", () => {
            alike(cli('-- a -b --c --d=e'), { $$: ['a', '-b', '--c', '--d=e'] })
            alike(cli('-- $ --'), { $$: ['$', '--'] })
            alike(cli('-a b -- $ --'), { $$: ['b', '$', '--'], $a: ['b', '$', '--'], a: true })
        })
        , test("word flag sets boolean", () => {
            alike(cli('--verbose'), { $$: [], verbose: true })
            alike(cli('--banana --apple --c -d'), {
                $$: [],
                apple: true, banana: true, c: true, d: true
            })
        })
        , test_err("empty key with word flag throws error", () => {
            cli('--=val')
        })
        , test_err("empty value with word flag throws error", () => {
            cli('--opt=')
        })
        , test("word flag with equals sets string", () => {
            alike(cli('--opt=some'), { $$: [], $opt: 'some' })
        })
        , test("post flag word arguments sets $value", () => {
            alike(cli('a -o b c'), {
                $$: ['a', 'b', 'c'],
                $o: ['b', 'c'],
                o: true
            })
        })
        , test("words and flags set different options: { $word:word, flag:true }", () => {
            alike(cli('--rover=some --rover'), { $$: [], $rover: 'some', rover: true })
            alike(cli('--rover --rover=mars'), { $$: [], $rover: 'mars', rover: true })
        })
        , test("long option overrides previous option", () => {
            alike(cli('--shape=square --shape=triangle'), { $$: [], $shape: 'triangle' })
        })
        , test("tag only created from single flags", () => {
            alike(cli('-ab uno --dos tres cuatro'), {
                $$: ['uno', 'tres', 'cuatro'],
                $dos: ['tres', 'cuatro'],
                a: true,
                b: true,
                dos: true
            })
        })

    ]
}