module.exports = async ({ test, alike }) => {

    const clia = require('../index')

    const cli = (text) => text && clia(text.split(' ')) || clia(text)

    return [
        test("key-value sets argument string", () => {
            alike(cli('--opt=some'), {
                arg: { opt: 'some' },
                args: { opt: ['some'] },
                opt: {},
                plain: []
            })
        })
        , test("key-value does not set opt", () => {
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
        , test("key-value saves all key values in args", () => {
            alike(cli('--shape=square --shape=triangle'), {
                arg: { shape: 'square' },
                args: { shape: ['square', 'triangle'] },
                opt: {},
                plain: []
            })
        })
    ]
}

