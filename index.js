const parse = (token) => {

    if (token.startsWith('--')) {
        if (token === '--')
            return { arg: '--' }

        const option = token.slice(2)

        if (option.includes('=')) {
            const [key, value] = option.split(/=(.*)/)
            if (key === '' || value === '')
                return { opt: [option] }
            else return { kv: { k: key, v: value } }
        }

        return { opt: [option] }
    }

    if (token.startsWith('-') && token.length > 1) {
        const options = token.slice(1).split('')
        return { opt: options }
    }

    return { arg: token }
}

const combine_input = (inputs) =>
    inputs.reduce((acc, next) => {

        const { opt, arg, kv } = acc.skip ? { arg: next } : parse(next)

        if (opt) {
            const options = opt.map(o => ({ [o]: true })).reduce((acc, next) => ({ ...acc, ...next }), {})
            return {
                tag: opt.length === 1 && opt.at(0) || acc.tag,
                opt: { ...acc.opt, ...options },
                args: acc.args,
                plain: acc.plain
            }
        }
        if (arg) {
            if (arg === '--' && !acc.skip) {
                acc.skip = true
            } else if (acc.tag) {
                acc.args[acc.tag] = [...acc.args[acc.tag] || [], arg]
            }
            else acc.plain.push(arg)
        }
        if (kv) {
            const { k, v } = kv
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
    })
}

const first_arg = (args) => Object.keys(args).reduce((acc, key) => {
    const [val] = args[key]
    const o = { [key]: val }
    return { ...o, ...acc }
}, {})

const validate_input = (args, alias) => {

    if (!Array.isArray(args) || !Array.isArray(alias))
        return { errors: [`Expected input to be array(s). Eg clia(process.argv.slice(2),['alias','names'])`] }

    const trim_filter = (input) => input
        .filter(a => typeof a === 'string')
        .filter(s => !s.includes('__proto__'))
        .filter(s => !s.includes('prototype'))
        .map(s => s.trim())
        .filter(s => s.length)

    const valid_args = trim_filter(args)
    const valid_alias = trim_filter(alias)

    const inputs_requirement = `Inputs should be non-empty strings which don't contain __proto__ or prototype.`
    const error_message = (inputs) => `One or more ${inputs} were excluded from parsing. ${inputs_requirement}`

    const errors = [
        valid_args.length < args.length ? error_message('args') : '',
        valid_alias.length < alias.length ? error_message('aliases') : '']
        .filter(e => e.length)

    return { valid_args, valid_alias, errors }
}

module.exports = (args = [], alias = []) => {

    const { valid_args, valid_alias, errors } = validate_input(args, alias)

    const parsed = combine_input(valid_args ?? [])

    copy_alias_values(parsed, valid_alias ?? [])

    return {
        arg: first_arg(parsed.args),
        args: parsed.args,
        opt: parsed.opt,
        plain: parsed.plain,
        ...(errors.length ? { errors } : {})
    }
}
