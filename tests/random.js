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

    const invalid_input = () => [`__proto__`, ` --=no-key`, ` --no-value=`][Math.floor(Math.random() * 3)]

    return [...Array(100).keys()].map(_ =>
        test("test random input only throws expected errors", () => {

            const random_input = shuffleArray(characters.split('')).join(' ')
                + (Math.random() * 100 > 80 ? invalid_input() : '')

            try {
                clia(random_input.split(' '))
            } catch (err) {
                if (err.message.includes('key-value has empty key or value')
                    || (err.message.includes('__proto__ not allowed'))) {
                    // expected error - do nothing.
                } else throw err
            }

        }))
}

