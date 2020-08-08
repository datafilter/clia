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
        + '=   =   =   =  =   =   =   =   =   ='
        + '- - - - - - - - - - - - - - - - - - '
        + `~!@#$%^&*()_+{}:"<>?,./;'[]-=\``

    return [...Array(100).keys()].map(_ =>
        test("test random input only throws expected errors", () => {

            const random_input = shuffleArray(characters.split('')).join('')
                + (Math.random() * 100 > 95 ? '__proto__' : '')
                + (Math.random() * 100 > 95 ? '--no-value=' : '')
                + (Math.random() * 100 > 95 ? '--=no-key' : '')

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

