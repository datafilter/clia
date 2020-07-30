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
    clia: 'hello'
}
```

## errors are thrown for:

* `__proto__`  to prevent prototype pollution
* multiple unflagged arguments, to prevent repetition/mismatch errors
* dangling `-` or `--` arguments

## testing

```bash
git clone https://github.com/devmachiine/clia.git
cd clia
npm test
```