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

## parsing

 * When an option is stated more than once, the last value is used

 ```javascript
test("last option/flag overrides previous options/flags", () => {
    alike({ rover: true }, cli(['--rover=some', '--rover']))
    alike({ rover: 'mars' }, cli(['--rover', '--rover=mars']))
})
```

## errors are thrown for:

* `__proto__`  to prevent prototype pollution
* dangling `-` or `--` arguments

## testing

Clone and run tests:

```bash
git clone https://github.com/devmachiine/clia.git
cd clia
npm i # optional
npm test
```

To run live aka hot-reload tests:
```bash
# ctrl+c to exit.
npm start 
```

## references

[The Art of Unix Programming](http://www.catb.org/~esr/writings/taoup/html/ch10s05.html)
[GNU argument syntax conventions](https://www.gnu.org/software/libc/manual/html_node/Argument-Syntax.html)