module.exports = async ({ test, equal }) => {

    const clia = require('../index')

    const cli = (text, alias) => text ? clia(text.split(' '), alias) : clia()

    return [
        test("alias does not add args or opt if they are not set", () => {
            equal(cli('-f banana apple --ananas dog cat', ['a', 'bark', 'york']), {
                arg: { ananas: 'dog', f: 'banana' },
                args: { f: ['banana', 'apple'], ananas: ['dog', 'cat'] },
                opt: { f: true, ananas: true },
                plain: []
            })
        })
        , test("alias sets arg and args values", () => {
            equal(cli('-f banana apple --animals dog cat', ['fruit', 'animals']), {
                arg: { fruit: 'banana', animals: 'dog', f: 'banana' },
                args: {
                    f: ['banana', 'apple'],
                    animals: ['dog', 'cat'],
                    fruit: ['banana', 'apple']
                },
                opt: { f: true, animals: true, fruit: true },
                plain: []
            })
        })
        , test("alias only sets arg for key-values, not opt", () => {
            equal(cli('--f=*.t3.js -d proj/tests proj/lib', ['filter']), {
                arg: { filter: '*.t3.js', f: '*.t3.js', d: 'proj/tests' },
                args: { f: ['*.t3.js'], filter: ['*.t3.js'], d: ['proj/tests', 'proj/lib'] },
                opt: { d: true },
                plain: []
            })
        })
        , test("options and args are applied to all aliases that start with the same letter", () => {
            equal(cli('-a b a', ['apple', 'anker']), {
                arg: { anker: 'b', apple: 'b', a: 'b' },
                args: { anker: ['b', 'a'], apple: ['b', 'a'], a: ['b', 'a'] },
                opt: { a: true, anker: true, apple: true },
                plain: []
            })
        })
    ]
}
