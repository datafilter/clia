// a argument, o option, kv key-value
const parse_arg = (arg) => {
    if (arg.includes('__proto__'))
        throw Error('__proto__ not allowed within an argument to prevent prototype pollution.')
    if (arg.startsWith('-$') || arg.startsWith('--$'))
        throw Error(`invalid arg: ${arg}\nflags cannot start with -$ or --$`)

    if (arg.startsWith('--')) {
        // single option OR key-value
        const flag = arg.slice(2)
        if (flag === '')
            throw Error('Option given without key. Expected extra character, eg: -h -v ..etc')
        else if (flag.includes('=')) {
            const [option, value] = flag.split('=')
            if (option === '' || value === '')
                throw Error(`Option key or value has length of 0 (${arg}). Expected at least one, eg: --pet=cat`)
            else {
                return ['kv', [option, value]]
            }
        }
        else return ['o', [flag]]
    }
    else if (arg.startsWith('-') && arg.length > 1) {
        // options
        const options = arg.slice(1).split('')
        return ['o', options]
    } else {
        // argument
        return ['a', arg]
    }
}

const add_args = (obj, key, val) => {
    if (!obj.args[key])
        obj.args[key] = [val]
    else obj.args[key].push(val)
}

const combine_options = (opts) =>
    opts.reduce((acc, next) => {
        const [kind, parsed] = parse_arg(next)

        if (kind === 'o') {
            const options = parsed.map(o => ({ [o]: true })).reduce((acc, next) => ({ ...acc, ...next }), {})
            acc.opt = { ...acc.opt, ...options }
            return {
                opts: { ...acc.opts, ...options },
                tag: parsed.length == 1 && parsed.find(_ => true) || acc.tag,
                opt: acc.opt,
                args: acc.args,
                plain: acc.plain
            }

        } else if (kind === 'a') {

            acc.opts.$$.push(parsed)

            if (acc.tag) {
                const prop = '$' + acc.tag
                if (!acc.opts[prop])
                    acc.opts[prop] = [parsed]
                else acc.opts[prop].push(parsed)
            }

            if (acc.tag) {
                add_args(acc, acc.tag, parsed)
            } else acc.plain.push(parsed)

            return acc

        } else if (kind === 'kv') {
            const [k, v] = parsed
            const obj = {}
            obj[`$${k}`] = v

            add_args(acc, k, v)

            return {
                opts: { ...acc.opts, ...obj },
                tag: acc.tag,
                opt: acc.opt,
                args: acc.args,
                plain: acc.plain
            }

        } else throw Error('kind mismatch')

    }, {
        opts: { $$: [] },
        tag: undefined,
        opt: {},
        args: {},
        plain: []
    })

module.exports = (args = []) => {
    const wip = combine_options(args)

    // add arg proxy to .clia.args

    return wip.opts
}
