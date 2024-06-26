module.exports = async ({ test, equal }) => {

    const clia = require('../index')

    const cli = (text) => text ? clia(text.split(' ')) : clia(text)

    return [
        test("key-value sets argument string", () => {
            equal(cli('--opt=some'), {
                arg: { opt: 'some' },
                args: { opt: ['some'] },
                opt: {},
                plain: []
            })
        })
        , test("key-value does not set opt", () => {
            equal(cli('--rock=quartz'), {
                arg: { rock: 'quartz' },
                args: { rock: ['quartz'] },
                opt: {},
                plain: []
            })
        })
        , test("key-value is saved regardles of same name option", () => {
            equal(cli('--rover=some --rover'), {
                arg: { rover: 'some' },
                args: { rover: ['some'] },
                opt: { rover: true },
                plain: []
            })
            equal(cli('--rover --rover=mars'), {
                arg: { rover: 'mars' },
                args: { rover: ['mars'] },
                opt: { rover: true },
                plain: []
            })
        })
        , test("key-value saves all key values in args", () => {
            equal(cli('--shape=square --shape=triangle'), {
                arg: { shape: 'square' },
                args: { shape: ['square', 'triangle'] },
                opt: {},
                plain: []
            })
        })
        , test("empty key key-value sets =option", () => {
            equal(cli('--=val'), {
                arg: {}, args: {}, opt: { '=val': true }, plain: []
            })
        })
        , test("empty value key-value sets option=", () => {
            equal(cli('--opt='), {
                arg: {}, args: {}, opt: { 'opt=': true }, plain: []
            })
        })
        , test("multiple = key-value splits on first = and saves all remaining characers", () => {
            equal(cli('--multi=equals=split=value'), {
                arg: { multi: 'equals=split=value' },
                args: { multi: ['equals=split=value'] },
                opt: {},
                plain: []
            })
        })
    ]
}

