const has = (a, prop) => Object.prototype.hasOwnProperty.call(a, prop)

const parse_arg = (arg, opts) => {
    if (arg.includes('__proto__'))
        throw Error('__proto__ not allowed as an argument to prevent prototype pollution.')

    if (arg.startsWith('--')) {
        // single flag OR long value
        const flag = arg.slice(2)
        if (flag === '')
            throw Error('Option - given without key. Expected extra character, eg: -h -v ..etc')
        else return { [flag]: true }
    } else if (arg.startsWith('-')) {
        // get bool flags
        const flag = arg.slice(1)
        if (flag === '')
            throw Error('Option - given without key. Expected extra character, eg: -h -v ..etc')
        else return flag
            .split('')
            .map(o => ({ [o]: true }))
            .reduce((acc, next) => ({ ...acc, ...next }), {})
    } else {
        // unflagged option
        return { 'clia': arg }
    }
    return 0
}

const combine_options = (opts) =>
    opts.reduce((acc, next) => {
        const parsed = parse_arg(next, acc)

        if (has(parsed, 'clia') && has(acc, 'clia'))
            throw Error(`unflagged option [${arg}] previously set with: [${opts}]`)

        return { ...parsed, ...acc }
    }, {})

// let flags = []
// let options = []
// let rest = []

module.exports = (args = []) => combine_options(args)
