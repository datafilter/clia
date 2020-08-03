const has = (a, prop) => Object.prototype.hasOwnProperty.call(a, prop)

const parse_arg = (arg) => {
    if (arg.includes('__proto__'))
        throw Error('__proto__ not allowed within an argument to prevent prototype pollution.')
    if (arg.startsWith('-$') || arg.startsWith('--$'))
        throw Error(`invalid arg: ${arg}\nflags cannot start with -$ or --$`)

    if (arg.startsWith('--')) {
        // single flag OR long value
        const flag = arg.slice(2)
        if (flag === '')
            throw Error('Option given without key. Expected extra character, eg: -h -v ..etc')
        else if (flag.includes('=')) {
            const [option, value] = flag.split('=')
            if (option === '' || value === '')
                throw Error(`Option key or value has length of 0 (${arg}). Expected at least one, eg: --pet=cat`)
            else {
                const obj = {}
                obj['$' + option] = value
                return obj
            }
        }
        else return { [flag]: true }
    }
    else if (arg.startsWith('-')) {
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
        return { '$$': [arg] }
    }
}

const combine_options = (opts) =>
    opts.reduce((acc, next) => {
        const parsed = parse_arg(next)

        if (has(parsed, '$$')) {
            const word = parsed.$$[0]
            // add word to $$
            acc.opts.$$.push(word)

            // add word to $flag []
            if (acc.tag) {
                const prop = '$' + acc.tag
                if (!acc.opts[prop])
                    acc.opts[prop] = [word]
                else acc.opts[prop].push(word)
            }

            return acc
        }
        else {
            const keys = Object.keys(parsed)
            const tag = (keys.length === 1 && parsed[keys[0]] === true)
                ? keys[0]
                : acc.tag

            return {
                opts: { ...acc.opts, ...parsed },
                tag
            }
        }
    }, {
        opts: { $$: [] },
        tag: undefined
    })

module.exports = (args = []) => combine_options(args).opts
