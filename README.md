#  clia

Command line arguments parser and [t3st](https://www.npmjs.com/package/t3st) example project

## usage

In your-node-app:

```js
const clia = require('clia')

const opts = clia(process.argv.slice(2))
```

From the command line input flags (abcd) and unflagged (hello)
```bash
node your-node-app -a -ab -cd hello
```

Yields
```js
opts === {
    a: true,
    b: true,
    c: true,
    d: true
    $$: ['hello']
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

## option -> boolean flag(s)

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

 * When a key-value option is stated more than once, the last value is used assigned

## errors are thrown for:

* `__proto__`  to prevent prototype pollution
* dangling `-` or `--` arguments (WIP `-` will become argument and `--` will indicate all subsequent input to be treated as arguments)

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