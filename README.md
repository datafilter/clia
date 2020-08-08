#  clia

Command line arguments parser and [t3st](https://www.npmjs.com/package/t3st) example project

## usage

In your [nodejs](https://www.w3schools.com/nodejs/) project dir, run:

```bash
npm i clia
```

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
  arg: { d: 'world' },
  args: { d: [ 'world' ] },
  opt: { a: true, b: true, d: true },
  plain: [ 'hello' ]
}
```

## parlance 

```
node your-app a -b c --d --e=f
```
```
a: plain argument
b: short option
c: tagged argument
d: long option
e+f: key-value
```

### **option**: boolean flag

* **long** option
  * starts with double `--`
  * refers to **one** option
* **short** option
  * starts with single `-`
  * refers to one **or more** options

### **argument**: string of one or more character(s)

* **plain**: 
  * argument(s) preceding any options
* **tagged**
  * argument(s) succeeding the last short option or long option
  * The `arg` object returns the first `args` if there are any
* **key-value**
  * `--key=value` tagged argument that only sets the argument
  * When a key-value option is stated more than once, all values are saved under `args`.

## parsing

* If `--` is encountered, it is ignored. All subsequent inputs are treated as arguments.
* An error is thrown when: 
  * any argument containts `__proto__`  *to prevent prototype pollution*
  * key-value pair with missing key or value, eg: `--store=` or `--=pet`

## testing

Clone and run tests:

```bash
git clone https://github.com/devmachiine/clia.git
cd clia
npm test
```

To run live _(aka hot-reload)_ tests:
```bash
npm i && npm i -g nodemon # optional to speed up reload
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