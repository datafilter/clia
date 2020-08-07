const parse_arg = (arg) => {
    if (arg.includes('__proto__'))
        throw Error('__proto__ not allowed within an argument to prevent prototype pollution.')

    if (arg.startsWith('--')) {
        if (arg === '--')
            return ['a', '--']

        const option = arg.slice(2)

        if (option.includes('=')) {
            const [key, value] = option.split('=')
            if (key === '' || value === '')
                throw Error(`key-value has empty key or value (${arg}). Expected at least one, eg: --pet=cat`)
            else {
                return ['kv', [key, value]]
            }
        }
        else return ['o', [option]]
    }
    else if (arg.startsWith('-') && arg.length > 1) {
        const options = arg.slice(1).split('')
        return ['o', options]
    } else {
        return ['a', arg]
    }
}

const combine_options = (opts) =>
    opts.reduce((acc, next) => {

        const [kind, parsed] = acc.skip ? ['a', next] : parse_arg(next)

        if (kind === 'o') {
            const options = parsed.map(o => ({ [o]: true })).reduce((acc, next) => ({ ...acc, ...next }), {})
            return {
                tag: parsed.length == 1 && parsed.find(_ => true) || acc.tag,
                opt: { ...acc.opt, ...options },
                args: acc.args,
                plain: acc.plain
            }
        }

        if (kind === 'a') {
            if (parsed === '--' && !acc.skip) {
                acc.skip = true
            } else if (acc.tag) {
                acc.args[acc.tag] = [...acc.args[acc.tag] || [], parsed]
            }
            else acc.plain.push(parsed)
            return acc
        }

        if (kind === 'kv') {
            const [k, v] = parsed
            acc.args[k] = [...acc.args[k] || [], v]
            return acc
        }
        else throw Error(`Unhandled combine option ${kind}`)
    }, {
        tag: undefined,
        skip: false,
        opt: {},
        args: {},
        plain: []
    })

const first_arg = (args) => Object.keys(args).reduce((acc, key) => {
    const [val] = args[key]
    const o = { [key]: val }
    return { ...o, ...acc }
}, {})

const copy_alias_values = (result, names) => {
    names.forEach(name => {
        const [letter] = name
        const arg_val = result.args[name] || result.args[letter]
        const opt_val = result.opt[name] || result.opt[letter]
        if (arg_val)
            result.args[name] = arg_val
        if (opt_val)
            result.opt[name] = opt_val
    });
}

module.exports = (args = [], alias = []) => {

    const parsed = combine_options(args)

    copy_alias_values(parsed, alias)

    return {
        arg: first_arg(parsed.args),
        args: parsed.args,
        opt: parsed.opt,
        plain: parsed.plain
    }
}
