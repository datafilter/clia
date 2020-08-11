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

const copy_alias_values = (parsed, names) => {
    names.forEach(name => {
        const [letter] = name
        if (parsed.args[letter])
            parsed.args[name] = parsed.args[letter]
        if (parsed.opt[letter])
            parsed.opt[name] = parsed.opt[letter]
    });
}

const first_arg = (args) => Object.keys(args).reduce((acc, key) => {
    const [val] = args[key]
    const o = { [key]: val }
    return { ...o, ...acc }
}, {})

const validate_input = (args, alias) => {

    if (!Array.isArray(args) || !Array.isArray(alias))
        return [[], [], [`Expected input to be array(s). Eg clia(process.argv.slice(2),['alias','names'])`]]

    const trim_filter = (input) => input
        .filter(a => typeof a === 'string')
        .filter(s => !s.includes('__proto__'))
        .filter(s => !s.includes('prototype'))
        .map(s => s.trim())
        .filter(s => s.length)

    const filter_reason = `Not a string, string is empty or spaces only, string contains __proto__ or prototype.`

    const valid_args = trim_filter(args)
    const valid_alias = trim_filter(alias)

    const errors = [
        valid_args.length < args.length ?
            `One or more args were excluded from parsing. Reason: ${filter_reason}` : '',
        valid_alias.length < alias.length ?
            `One or more aliases were excluded from parsing. Reason: ${filter_reason}` : '']
        .filter(e => e.length)

    return [valid_args, valid_alias, errors]
}

module.exports = (args = [], alias = []) => {

    const [valid_args, valid_alias, errors] = validate_input(args, alias)

    const parsed = combine_input(valid_args)

    copy_alias_values(parsed, valid_alias)

    const result = {
        arg: first_arg(parsed.args),
        args: parsed.args,
        opt: parsed.opt,
        plain: parsed.plain
    }

    return errors.length ? { ...{ errors }, ...result } : result
}
