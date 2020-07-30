const parse_arg = (arg) => {
    if (arg.startsWith('--')) {
        // single flag OR long value
    } else if (arg.startsWith('-')) {
        // get bool flags
    }
    return 0
}


// let flags = []
// let options = []
// let rest = []

module.exports = (args = []) => {

    if (args.some(a => a.toLowerCase().includes('__proto__'))) {
        throw Error('__proto__ not allowed as an argument to prevent prototype pollution.')
    }

    return {}
}