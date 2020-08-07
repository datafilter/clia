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
        , test_err("empty key with word flag throws error", () => {
            cli('--=val')
        })
        , test_err("empty value with word flag throws error", () => {
            cli('--opt=')
        })
        , test("no args return object without values", () => {
            alike(cli(), { arg: {}, args: {}, opt: {}, plain: [] })
        })
        , test("single plain argument set in plain property", () => {
            alike(cli('there'), { arg: {}, args: {}, opt: {}, plain: ['there'] })
            alike(cli('$'), { arg: {}, args: {}, opt: {}, plain: ['$'] })
        })
        , test("multiple plain arguments are set in plain property", () => {
            alike(cli('one two three $four $$five $$$ix'), {
                arg: {},
                args: {},
                opt: {},
                plain: ['one', 'two', 'three', '$four', '$$five', '$$$ix']
            })
        })
        , test("short option can start with $", () => {
            alike(cli('-$'), { arg: {}, args: {}, opt: { '$': true }, plain: [] })
            alike(cli('-$ab'), { arg: {}, args: {}, opt: { '$': true, a: true, b: true }, plain: [] })
        })
        , test("long option can start with $", () => {
            alike(cli('--$'), { arg: {}, args: {}, opt: { '$': true }, plain: [] })
            alike(cli('--$a'), { arg: {}, args: {}, opt: { '$a': true }, plain: [] })
        })
        , test("short options sets booleans", () => {
            alike(cli('-v'), { arg: {}, args: {}, opt: { v: true }, plain: [] })
            alike(cli('-vw'), { arg: {}, args: {}, opt: { v: true, w: true }, plain: [] })
            alike(cli('-ab -b -c'), { arg: {}, args: {}, opt: { a: true, b: true, c: true }, plain: [] })
            alike(cli('-a-_'), { arg: {}, args: {}, opt: { a: true, '-': true, _: true }, plain: [] })
            alike(cli('-v lemon -s'), {
                arg: { v: 'lemon' },
                args: { v: ['lemon'] },
                opt: { v: true, s: true },
                plain: []
            })
        })
        , test("single dash is an argument", () => {
            alike(cli('-'), { arg: {}, args: {}, opt: {}, plain: ['-'] })
        })
        , test("1st double dash is ignored ", () => {
            alike(cli('--'), { arg: {}, args: {}, opt: {}, plain: [] })
        })
        , test("arguments after -- are parsed as args verbatim", () => {
            alike(cli('-- a -b --c --d=e'), { arg: {}, args: {}, opt: {}, plain: ['a', '-b', '--c', '--d=e'] })
            alike(cli('-- $ --'), { arg: {}, args: {}, opt: {}, plain: ['$', '--'] })
            alike(cli('-a b -- $ --'), {
                arg: { a: 'b' },
                args: { a: ['b', '$', '--'] },
                opt: { a: true },
                plain: []
            })
        })
        , test("options sets boolean value(s) in opt", () => {
            alike(cli('--verbose -a'), {
                arg: {},
                args: {},
                opt: { verbose: true, a: true },
                plain: []
            })
            alike(cli('--banana --apple --c -de'), {
                arg: {},
                args: {},
                opt: { banana: true, apple: true, c: true, d: true, e: true },
                plain: []
            })
        })
        , test("key-value sets argument string", () => {
            alike(cli('--opt=some'), {
                arg: { opt: 'some' },
                args: { opt: ['some'] },
                opt: {},
                plain: []
            })
        })
        , test("post option arguments are saved in args", () => {
            alike(cli('a -o b c'), {
                arg: { o: 'b' },
                args: { o: ['b', 'c'] },
                opt: { o: true },
                plain: ['a']
            })
        })
        , test("key-value does not imply option is true", () => {
            alike(cli('--rock=quartz'), {
                arg: { rock: 'quartz' },
                args: { rock: ['quartz'] },
                opt: {},
                plain: []
            })
        })
        , test("key-value is saved regardles of same name option", () => {
            alike(cli('--rover=some --rover'), {
                arg: { rover: 'some' },
                args: { rover: ['some'] },
                opt: { rover: true },
                plain: []
            })
            alike(cli('--rover --rover=mars'), {
                arg: { rover: 'mars' },
                args: { rover: ['mars'] },
                opt: { rover: true },
                plain: []
            })
        })
        , test("long option saves all key values in args", () => {
            alike(cli('--shape=square --shape=triangle'), {
                arg: { shape: 'square' },
                args: { shape: ['square', 'triangle'] },
                opt: {},
                plain: []
            })
        })
        , test("args only created from single options", () => {
            alike(cli('-ab uno --dos tres cuatro -c si'), {
                arg: { c: 'si', dos: 'tres' },
                args: { dos: ['tres', 'cuatro'], c: ['si'] },
                opt: { a: true, b: true, dos: true, c: true },
                plain: ['uno']
            })
        })

    ]
}