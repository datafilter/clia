module.exports = async ({ test, alike }) => {

    const clia = require('../index')

    const cli = (text) => text && clia(text.split(' ')) || clia(text)

    return [
        test("no args return object without values", () => {
            alike(cli(), { arg: {}, args: {}, opt: {}, plain: [] })
        })
        , test("single plain argument(s) set in plain property", () => {
            alike(cli('there'), { arg: {}, args: {}, opt: {}, plain: ['there'] })
            alike(cli('$'), { arg: {}, args: {}, opt: {}, plain: ['$'] })
        })
        , test("multiple plain arguments are set in plain property", () => {
            alike(cli('one two three $four @ ?.'), {
                arg: {}, args: {}, opt: {},
                plain: ['one', 'two', 'three', '$four', '@', '?.']
            })
        })
        // ---------- ---------- ---------- options
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
        , test("long option sets boolean value(s)", () => {
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
        , test("options saves all key values in args", () => {
            alike(cli('--shape square triangle circle -u n i'), {
                arg: { shape: 'square', u: 'n' },
                args: { shape: ['square', 'triangle', 'circle'], u: ['n', 'i'] },
                opt: { shape: true, u: true },
                plain: []
            })
        })
        // ---------- ---------- ---------- arguments
        , test("post option arguments are saved in args", () => {
            alike(cli('a -o b c'), {
                arg: { o: 'b' },
                args: { o: ['b', 'c'] },
                opt: { o: true },
                plain: ['a']
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
        // ---------- ---------- ---------- spaced input
        , test("spaces are trimmed", () => {
            const spaced_input = ['--shape  ', '    square', '   triangle   ', 'circle', ' -u ', ' n', ' i']
            alike(clia(spaced_input), {
                arg: { shape: 'square', u: 'n' },
                args: { shape: ['square', 'triangle', 'circle'], u: ['n', 'i'] },
                opt: { shape: true, u: true },
                plain: []
            })
        })
    ]
}