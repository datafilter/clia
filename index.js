module.exports = (args) => {

    if (args.some(a => a.toLowerCase().includes('__proto__'))) {
        throw Error('__proto__ not allowed as an argument to prevent prototype pollution.')
    }
}