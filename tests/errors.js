module.exports = async ({ test, alike }) => {

    const clia = require('../index')

    const cli = (text) => text && clia(text.split(' ')) || clia(text)

    const empty = {
        arg: {},
        args: {},
        opt: {},
        plain: []
    }

    const args_error_message = 'One or more args were excluded from parsing. Reason: Not a string, string is empty or spaces only, string contains __proto__ or prototype.'

    const args_error_obj = {
        errors: [args_error_message]
    }

    return [
        test("prototype pollution returns error", () => {
            alike(cli('__proto__'), {
                ...empty,
                ...args_error_obj
            })
        })
        , test("valid arguments are still parsed", () => {
            alike(cli('valid --ok=yes prototype last-token'), {
                errors: [
                    'One or more args were excluded from parsing. Reason: Not a string, string is empty or spaces only, string contains __proto__ or prototype.'
                ],
                arg: { ok: 'yes' },
                args: { ok: ['yes'] },
                opt: {},
                plain: ['valid', 'last-token']
            })
        })
        , test("prevents proto even after -- verbatim operator", () => {
            alike(cli('some --ok arguments then -- __proto__ potatoprototype last'), {
                arg: { ok: 'arguments' },
                args: { ok: ['arguments', 'then', 'last'] },
                opt: { ok: true },
                plain: ['some'],
                errors: [args_error_message]
            })
        })
        , test("non array input(s) returns errors", () => {
            const input_error_result = {
                ...empty,
                errors: ["Expected input to be array(s). Eg clia(process.argv.slice(2),['alias','names'])"],
            }
            alike(clia('string input fails'), input_error_result)
            alike(clia(123), input_error_result)
            alike(clia({ a: 'bc' }), input_error_result)
        })
        , test("empty or non-string inputs are ignored", () => {
            /* eslint-disable no-sparse-arrays */
            alike(clia([, , , ,]), {
                ...empty,
                ...args_error_obj
            })
            alike(clia([1, { hello: 'world' }, true]), {
                ...empty,
                ...args_error_obj
            })
            alike(clia([true, '--key=val', 3, , {}, 'a']), clia([, '--key=val', undefined, 'a']))
            const mixed = ['--shape', '   ', , , , 'square', ' ', undefined, '', '', 'triangle', 'circle', '-u', 'n', 'i']
            // /* eslint-enable no-sparse-arrays */
            alike(clia(mixed), {
                arg: { u: 'n', shape: 'square' },
                args: { shape: ['square', 'triangle', 'circle'], u: ['n', 'i'] },
                opt: { shape: true, u: true },
                plain: [],
                errors: [args_error_message]
            })
        })
    ]
}