module.exports = ({ test }) => {

    const clia = require('../index')

    // Durstenfeld shuffle https://stackoverflow.com/a/12646864
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        + 'abcdefghijklmnopqrstuvwxyz0123456789'
        + '-=--=--=--=--=--=--=--=--=--=--=--=-'
        + `~!@#$%^&*()_+{}:"<>?,./;'[]-=\``

    const invalid_input = [`__proto__`, ` --=no-key`, ` --no-value=`]

    const repeat_test = (name, times, f) => test(name, () => [...Array(times).keys()].map(f))

    return [
        repeat_test("test random input only throws expected errors", 100, () => {
            const random_input = shuffleArray(characters.split('')).join(' ')
                + (Math.random() * 100 < 80 ? '' : shuffleArray(invalid_input).find(_ => true))

            try {
                clia(random_input.split(' '))
            } catch (err) {
                if (err.message.includes('key-value has empty key or value')
                    || (err.message.includes('__proto__ not allowed'))) {
                    // expected error - do nothing.
                } else throw err
            }
        })
    ]
}

