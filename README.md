#  clia

Command line arguments parser. Similar to [command-line-args](https://www.npmjs.com/package/command-line-args), [getopts](https://www.npmjs.com/package/getopts) and [nopt](https://www.npmjs.com/package/nopt), but quite smaller with less files and jokes.

You can give it a quick test [in your browser on runkit](https://npm.runkit.com/clia) with
```js
const conf = clia('hello -a -ab -d world'.split(' '))
```

Like the other parsers, clia follows the same syntax conventions documented in [design docs](https://github.com/datafilter/clia/blob/master/notes.md) with [lots of tests/examples here](
https://github.com/datafilter/clia/tree/master/tests). 


## usage

Example command line input:

```bash
node your-app hello -a -ab -d world
```

In `your-app` you get parsed command line arguments as follows:

```js
const clia = require('clia')

const conf = clia(process.argv.slice(2))

conf === {
  // arguments before any options
  plain: [ 'hello' ], 
  // options saved in opt (eg. --a -bd)
  opt: { a: true, b: true, d: true }, 
  // arguments after options are tagged with the last option (eg -d world, or --d world)
  // argument --key=value also saved in args, eg --d=world
  args: { d: [ 'world' ] }, 
  // the first value of each args property, so that you can use arg.prop instead of args.prop[0]
  arg: { d: 'world' }, 
}
```

## alias

Pass a second argument to clia to specify aliases:

```javascript
clia('run -o yaml --d=/usr/bin --fruit=mango'.split(' ')
                , ['output', 'directory', 'fruit'])
```
yields
```javascript
{
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
}
```

## edge cases

Spaces are trimmed from inputs.

Empty or non-string inputs are ignored. 

Inputs that contain `__proto__` or `prototype` are ignored. *(To prevent prototype pollution.)*

If there are any errors, there will be an `errors` property in the return value

Example *invalid* command line input:

```bash
node your-app.js valid --ok=yes prototype last-token
```
yields
```javascript
{
    errors: [
        'One or more args were excluded from parsing. Reason: Not a string, string is empty or spaces only, string contains __proto__ or prototype.'
    ],
    arg: { ok: 'yes' },
    args: { ok: ['yes'] },
    opt: {},
    plain: ['valid', 'last-token']
}
```

It is recommended that you check for any input errors.

```javascript
// in main.js/index.js
const conf = clia(process.argv.slice(2))

if(conf.errors){
    // graceful exit
    console.log('Could not parse command line input, errors:')
    console.log(conf.errors)
    require('process').exitCode(1)
    return
}
```

When `--` is encountered, it is ignored. All subsequent inputs are treated as arguments even if they start with `-`.

Key-values with missing key or value are saved as is, eg: 

option `--store=` yields: `{ .. opt: { 'store=': true }`

option `--=pet` yields: `{ .. opt: { '=pet': true }`

## example

An example of where clia is used to parse command line arguments, with "autocomplete" _(`Cli option not found. Did you mean ___`)_ can be found [here](https://github.com/datafilter/t3st/blob/master/bin/parse.js)



