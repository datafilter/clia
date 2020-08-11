const parse_arg = (arg) => {

    if (arg.startsWith('--')) {
        if (arg === '--')
            return ['a', '--']

        const option = arg.slice(2)

        if (option.includes('=')) {
            const [key, value] = option.split(/=(.*)/)
            if (key === '' || value === '')
                return ['o', [option]]
            else return ['kv', [key, value]]
        }

        return ['o', [option]]
    }

    if (arg.startsWith('-') && arg.length > 1) {
        const options = arg.slice(1).split('')
        return ['o', options]
    }

    return ['a', arg]
}

const combine_input = (inputs) =>
    inputs.reduce((acc, next) => {

        if (next.includes('__proto__') || next.includes('prototype'))
            throw Error(`invalid input: __proto__ and prototype is not allowed within any argument or options.`)

        const [kind, parsed] = acc.skip ? ['a', next] : parse_arg(next)

        if (kind === 'o') {
            const options = parsed.map(o => ({ [o]: true })).reduce((acc, next) => ({ ...acc, ...next }), {})
            return {
                tag: parsed.length == 1 && parsed.find(_ => true) || acc.tag,
                opt: { ...acc.opt, ...options },
                args: acc.args,
                plain: acc.plain,
                errors: acc.errors
            }
        }
        else if (kind === 'a') {
            if (parsed === '--' && !acc.skip) {
                acc.skip = true
            } else if (acc.tag) {
                acc.args[acc.tag] = [...acc.args[acc.tag] || [], parsed]
            }
            else acc.plain.push(parsed)
        }
        else if (kind === 'kv') {
            const [k, v] = parsed
            acc.args[k] = [...acc.args[k] || [], v]
        }

        return acc
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

const copy_alias_values = (parsed, names) => {
    names.forEach(name => {
        const [letter] = name
        if (parsed.args[letter])
            parsed.args[name] = parsed.args[letter]
        if (parsed.opt[letter])
            parsed.opt[name] = parsed.opt[letter]
    });
}

const trim_filter = (input) => input
    .filter(a => typeof a === 'string')
    .map(s => s.trim())
    .filter(s => s.length)

module.exports = (args = [], alias = []) => {

    if (!Array.isArray(args) || !Array.isArray(alias))
        throw Error(`expected input to be array(s). Eg clia(process.argv.slice(2),['alias','names'])`)

    const parsed = combine_input(trim_filter(args))

    copy_alias_values(parsed, trim_filter(alias))

    const result = {
        arg: first_arg(parsed.args),
        args: parsed.args,
        opt: parsed.opt,
        plain: parsed.plain
    }

    return result

}
