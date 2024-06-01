module.exports = async ({ test, equal }) => {

    const clia = require('../index')

    const cli = (text) => text ? clia(text.split(' ')) : clia(text)

    const empty = {
        arg: {},
        args: {},
        opt: {},
        plain: []
    }

    const args_error_message = "One or more args were excluded from parsing. Inputs should be non-empty strings which don't contain __proto__ or prototype."

    const args_error_obj = {
        errors: [args_error_message]
    }

    return [
        test("prototype pollution returns error", () => {
            equal(cli('__proto__'), {
                ...empty,
                ...args_error_obj
            })
        })
        , test("valid arguments are still parsed", () => {
            equal(cli('valid --ok=yes prototype last-token'), {
                errors: [ args_error_message ],
                arg: { ok: 'yes' },
                args: { ok: ['yes'] },
                opt: {},
                plain: ['valid', 'last-token']
            })
        })
        , test("prevents proto even after -- verbatim operator", () => {
            equal(cli('some --ok arguments then -- __proto__ potatoprototype last'), {
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
            equal(clia('string input fails'), input_error_result)
            equal(clia(123), input_error_result)
            equal(clia({ a: 'bc' }), input_error_result)
        })
        , test("empty or non-string inputs are ignored", () => {
            equal(clia([, , , ,]), {
                ...empty,
                ...args_error_obj
            })
            equal(clia([1, { hello: 'world' }, true]), {
                ...empty,
                ...args_error_obj
            })
            equal(clia([true, '--key=val', 3, , {}, 'a']), clia([, '--key=val', undefined, 'a']))
            const mixed = ['--shape', '   ', , , , 'square', ' ', undefined, '', '', 'triangle', 'circle', '-u', 'n', 'i']
            equal(clia(mixed), {
                arg: { u: 'n', shape: 'square' },
                args: { shape: ['square', 'triangle', 'circle'], u: ['n', 'i'] },
                opt: { shape: true, u: true },
                plain: [],
                errors: [args_error_message]
            })
        })
    ]
}
