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

const push_args = (obj, key, val) => {
    if (!obj.args[key])
        obj.args[key] = [val]
    else obj.args[key].push(val)
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
        } else if (kind === 'a') {

            if (parsed === '--' && !acc.skip) {
                acc.skip = true
            } else if (acc.tag) {
                push_args(acc, acc.tag, parsed)
            }
            else acc.plain.push(parsed)

            return acc

        } else if (kind === 'kv') {
            
            const [k, v] = parsed

            push_args(acc, k, v)

            return acc

        } else throw Error('kind mismatch')

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
        result.args[name] = result.args[name] || result.args[letter]
        result.opt[name] = result.opt[name] || result.opt[letter]
    });
    return result
}

module.exports = (args = [], alias = []) => {
    const parsed = combine_options(args)

    const arg = first_arg(parsed.args)

    copy_alias_values(parsed, alias)

    const result = {
        arg: arg,
        args: parsed.args,
        opt: parsed.opt,
        plain: parsed.plain
    }

    return result
}
