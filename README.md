#  clia

Command line arguments parser and [t3st](https://www.npmjs.com/package/t3st) example project

## usage

In your-node-app:

```js
const clia = require('clia')

const opts = clia(process.argv.slice(2))
```

From the command line input:
```bash
node your-node-app hello -a -ab -d world
```

Yields
```js
{
  arg: { d: 'world' },
  args: { d: [ 'world' ] },
  opt: { a: true, b: true, d: true },
  plain: [ 'hello' ]
}
```

## parlance - options and arguments

```
cli a -b c --d --e=f
a: argument (untagged)
b: option (short)
c: argument (tagged)
d: option (long)
e: option (key-value)
f: argument (key-value)
```

### option -> boolean flag(s)

* **short** option
  * starts with single `-`
  * refers to one or more options
* **long** option
  * starts with double `--`
  * refers to one option
* **key-value** option
  * the `key` in `--key=value`

### argument -> character(s)

* **untagged**: 
  * argument(s) preceding any options
* **tagged**
  * argument(s) succeeding the last short option or long option
* **key-value** argument
  * the `value` in `--key=value`

## parsing

* If a `--` is encountered, it is ignored. All subsequent inputs are treated as arguments.

## output

* When a key-value option is stated more than once, all values are saved under `args`.

* The `arg` object returns the first `args` if there are any

## edge cases

* `__proto__`  to prevent prototype pollution
* key-value pair with missing value, eg: `--store=`

## testing

Clone and run tests:

```bash
git clone https://github.com/devmachiine/clia.git
cd clia
npm i # optional
npm i -g nodemon # optional
npm test
```

To run live _(aka hot-reload)_ tests:
```bash
# ctrl+c to exit.
npm start 
```

## references

[The Art of Unix Programming](http://www.catb.org/~esr/writings/taoup/html/ch10s05.html)

[GNU argument syntax conventions](https://www.gnu.org/software/libc/manual/html_node/Argument-Syntax.html)

[getopts](https://github.com/jorgebucaran/getopts#readme) (therefore [this IEEE doc](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html#tag_12_02))

![CI](https://github.com/devmachiine/clia/workflows/CI/badge.svg)

[![License](https://img.shields.io/badge/license-MIT-black)](https://img.shields.io/badge/license-MIT-black)

<!-- Todo Metrics
[![Snyk](https://img.shields.io/npm/t3st/two.svg)](https://npmjs.com/two)
[![Coverage](https://img.shields.io/npm/t3st/four.svg)](https://npmjs.com/four)
[![OtherMetric](https://img.shields.io/npm/t3st/one.svg)](https://npmjs.com/one)
-->