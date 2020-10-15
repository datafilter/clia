module.exports = ({ test, check }) => {

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
        + '                                    '
        + `~!@#$%^&*()_+{}:"<>?,./;'[]-=\``

    const invalid_input = [`__proto__`, ` --=no-key`, ` --no-value=`]

    const repeat_test = (name, times, f) => test(name, () => [...Array(times).keys()].map(f))

    const random_input = () => shuffleArray(characters.split('')).join('')
        + (Math.random() * 100 < 80 ? '' : shuffleArray(invalid_input).find(_ => true))

    const parse_arg = (arg) => {

        if (arg.startsWith('--')) {
            if (arg === '--')
                return ['a', '--']

            const option = arg.slice(2)

            if (option.includes('=')) {
                const [key, value] = option.split('=')
                if (key === '' || value === '')
                    throw Error(`key-value has empty key or value (${arg}). Expected at least one, eg: --pet=cat`)

                return ['kv', [key, value]]
            }

            return ['o', [option]]
        }

        if (arg.startsWith('-') && arg.length > 1) {
            const options = arg.slice(1).split('')
            return ['o', options]
        }

        return ['a', arg]
    }

    return [
        repeat_test("input only throws expected errors", 100, () => {
            try {
                clia(random_input().split(' '))
            } catch (err) {
                if (err.message.includes('__proto__')) {
                    // expected error - do nothing.
                } else throw err
            }
        })
        , repeat_test("has tokens for every valid input", 1000, () => {
            try {
                const input = random_input().split(' ')
                const parsed = clia(input)

                const arg_values = Object.keys(parsed.args).flatMap(arg => parsed.args[arg])

                const sum_plain = parsed.plain.length
                const sum_opt = Object.keys(parsed.opt).length
                const sum_args = arg_values.length
                const sum_parsed = sum_plain + sum_opt + sum_args

                const trim_filter = (input) => input
                    .filter(a => typeof a === 'string')
                    .map(s => s.trim())
                    .filter(s => s.length)

                const valid_inputs = trim_filter(input)

                // general property is that parsed gives more or equal tokens than input
                if (valid_inputs.length > sum_parsed) {

                    // with exception: when input contains a skip token -- 
                    if (!input.some(i => i === '--')) {

                        // or when input constains duplicate boolean flag(s), eg --s -v -sv -vs --v

                        const unique_inputs = new Set(valid_inputs).size

                        if (unique_inputs < sum_parsed) {

                            let previous_parse = {}

                            // loop through all inputs one by one, untill one doesn't change the output. (thats the proof)
                            for (let i = 1; i <= valid_inputs.length; i++) {
                                const new_parse = clia(valid_inputs.slice(0, i))

                                if (JSON.stringify(new_parse) === JSON.stringify(previous_parse)) {

                                    const ignored_input = valid_inputs[i - 1]

                                    const [kind, options] = parse_arg(ignored_input)

                                    // the ignored new token is an option
                                    check(ignored_input, c => c.startsWith('-'))
                                    check(kind, k => k === 'o')

                                    // that has already been set in parsed.opt
                                    check(options, previous_parse, (opts, prev) => opts.some(o => prev.opt[o]))

                                } else previous_parse = new_parse
                            }
                        }
                    }
                }

            } catch (err) {
                if (err.message.includes('__proto__')) {
                    // expected error - do nothing.
                } else throw err
            }
        })
    ]
}

