module.exports = ({ test, alike }) => {

    const clia = require('../index')

    return [
        test("demo short option", () => {
            const example = clia('hello -a -ab -d world'.split(' '))
            alike(example, {
                arg: { d: 'world' },
                args: { d: ['world'] },
                opt: { a: true, b: true, d: true },
                plain: ['hello']
            })
        }),
        test("demo alias", () => {
            const example = clia('run -o yaml --d=/usr/bin --fruit=mango'.split(' ')
                , ['output', 'directory', 'fruit'])
            alike(example, {
                arg: {
                    o: 'yaml', output: 'yaml',
                    d: '/usr/bin', directory: '/usr/bin',
                    fruit: 'mango'
                },
                args: {
                    o: ['yaml'], output: ['yaml'],
                    d: ['/usr/bin'], directory: ['/usr/bin'],
                    // note key-value doesn't set option
                    // even when kv/value matches alias 
                    fruit: ['mango']
                },
                // note key-value doesn't set opt
                // even when kv/value is short option that has an alias
                opt: { o: true, output: true },
                plain: ['run']
            })
        })
    ]
}
