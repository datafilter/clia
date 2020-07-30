#  clia

Command line parser and t3st example project

## usage

```js
const clia = require('clia')

const opts = process.argv.slice(2)
```

Input
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

## Errors are thrown for:

* `__proto__`  to prevent prototype pollution
* multiple unflagged arguments to prevent repetition/mismatch error
* dangling `-` or `--` arguments

##  Testing

```bash
git clone https://github.com/devmachiine/clia.git
cd clia
npm test
```