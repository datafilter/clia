module.exports = async ({ test, equal }) => {

    const clia = require('../index')

    const cli = (text) => text && clia(text.split(' ')) || clia(text)

    return [
        test("no args return object without values", () => {
            equal(cli(), { arg: {}, args: {}, opt: {}, plain: [] })
        })
        , test("single plain argument(s) set in plain property", () => {
            equal(cli('there'), { arg: {}, args: {}, opt: {}, plain: ['there'] })
            equal(cli('$'), { arg: {}, args: {}, opt: {}, plain: ['$'] })
        })
        , test("multiple plain arguments are set in plain property", () => {
            equal(cli('one two three $four @ ?.'), {
                arg: {}, args: {}, opt: {},
                plain: ['one', 'two', 'three', '$four', '@', '?.']
            })
        })
        // ---------- ---------- ---------- options
        , test("short option can start with $", () => {
            equal(cli('-$'), { arg: {}, args: {}, opt: { '$': true }, plain: [] })
            equal(cli('-$ab'), { arg: {}, args: {}, opt: { '$': true, a: true, b: true }, plain: [] })
        })
        , test("long option can start with $", () => {
            equal(cli('--$'), { arg: {}, args: {}, opt: { '$': true }, plain: [] })
            equal(cli('--$a'), { arg: {}, args: {}, opt: { '$a': true }, plain: [] })
        })
        , test("short options sets booleans", () => {
            equal(cli('-v'), { arg: {}, args: {}, opt: { v: true }, plain: [] })
            equal(cli('-vw'), { arg: {}, args: {}, opt: { v: true, w: true }, plain: [] })
            equal(cli('-ab -b -c'), { arg: {}, args: {}, opt: { a: true, b: true, c: true }, plain: [] })
            equal(cli('-a-_'), { arg: {}, args: {}, opt: { a: true, '-': true, _: true }, plain: [] })
            equal(cli('-v lemon -s'), {
                arg: { v: 'lemon' },
                args: { v: ['lemon'] },
                opt: { v: true, s: true },
                plain: []
            })
        })
        , test("long option sets boolean value(s)", () => {
            equal(cli('--verbose -a'), {
                arg: {},
                args: {},
                opt: { verbose: true, a: true },
                plain: []
            })
            equal(cli('--banana --apple --c -de'), {
                arg: {},
                args: {},
                opt: { banana: true, apple: true, c: true, d: true, e: true },
                plain: []
            })
        })
        , test("options saves all key values in args", () => {
            equal(cli('--shape square triangle circle -u n i'), {
                arg: { shape: 'square', u: 'n' },
                args: { shape: ['square', 'triangle', 'circle'], u: ['n', 'i'] },
                opt: { shape: true, u: true },
                plain: []
            })
        })
        // ---------- ---------- ---------- arguments
        , test("post option arguments are saved in args", () => {
            equal(cli('a -o b c'), {
                arg: { o: 'b' },
                args: { o: ['b', 'c'] },
                opt: { o: true },
                plain: ['a']
            })
        })
        , test("args only created from single options", () => {
            equal(cli('-ab uno --dos tres cuatro -c si'), {
                arg: { c: 'si', dos: 'tres' },
                args: { dos: ['tres', 'cuatro'], c: ['si'] },
                opt: { a: true, b: true, dos: true, c: true },
                plain: ['uno']
            })
        })
        , test("single dash is an argument", () => {
            equal(cli('-'), { arg: {}, args: {}, opt: {}, plain: ['-'] })
        })
        , test("1st double dash is ignored ", () => {
            equal(cli('--'), { arg: {}, args: {}, opt: {}, plain: [] })
        })
        , test("arguments after -- are parsed as args verbatim", () => {
            equal(cli('-- a -b --c --d=e'), { arg: {}, args: {}, opt: {}, plain: ['a', '-b', '--c', '--d=e'] })
            equal(cli('-- $ --'), { arg: {}, args: {}, opt: {}, plain: ['$', '--'] })
            equal(cli('-a b -- $ --'), {
                arg: { a: 'b' },
                args: { a: ['b', '$', '--'] },
                opt: { a: true },
                plain: []
            })
        })
        // ---------- ---------- ---------- spaced input
        , test("spaces are trimmed", () => {
            const spaced_input = ['--shape  ', '    square', '   triangle   ', 'circle', ' -u ', ' n', ' i']
            equal(clia(spaced_input), {
                arg: { shape: 'square', u: 'n' },
                args: { shape: ['square', 'triangle', 'circle'], u: ['n', 'i'] },
                opt: { shape: true, u: true },
                plain: []
            })
        })
    ]
}