#  clia

Command line arguments parser and [t3st](https://www.npmjs.com/package/t3st) example project.

## usage

Example command line input:

```bash
node your-node-app hello -a -ab -d world
```

In your-node-app:

```js
const clia = require('clia')

const conf = clia(process.argv.slice(2)) // in your app

// test in your browser on: https://npm.runkit.com/clia
// const conf = clia('hello -a -ab -d world'.split(' '))

conf === {
  // arguments before any options
  plain: [ 'hello' ], 
  // options saved in opt (eg. --a -bd)
  opt: { a: true, b: true, d: true }, 
  // arguments after options are tagged with the last option (eg -d world, or --d world)
  // argument --key=value also saved in args, eg --d=world
  args: { d: [ 'world' ] }, 
  // the first value of each args property, so that you can use arg.prop[0] instead of args.prop[0]
  arg: { d: 'world' }, 
}
```

## parsing

If `--` is encountered, it is ignored. All subsequent inputs are treated as arguments.

An error is thrown when: 
* any argument containts `__proto__`  *to prevent prototype pollution*
* key-value pair with missing key or value, eg: `--store=` or `--=pet`

## alias

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

## Docs

[All examples here](https://github.com/devmachiine/clia/tree/master/tests)

[Dev/specs](https://github.com/devmachiine/clia/blob/master/notes.md)


![CI](https://github.com/devmachiine/clia/workflows/CI/badge.svg)

[![License](https://img.shields.io/badge/license-MIT-black)](https://img.shields.io/badge/license-MIT-black)

<!-- Todo Metrics
[![Snyk](https://img.shields.io/npm/t3st/two.svg)](https://npmjs.com/two)
[![Coverage](https://img.shields.io/npm/t3st/four.svg)](https://npmjs.com/four)
[![OtherMetric](https://img.shields.io/npm/t3st/one.svg)](https://npmjs.com/one)
-->