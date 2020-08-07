module.exports = ({ test, alike }) => {

    const clia = require('../index')

    return [
        test("demo", () => {
            const example = clia('hello -a -ab -d world'.split(' '))
            alike(example, {
                arg: { d: 'world' },
                args: { d: [ 'world' ] },
                opt: { a: true, b: true, d: true },
                plain: [ 'hello' ]
              })
        })
    ]
}