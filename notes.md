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
  * argument(s) succeeding the last **single** short option or long option
  * The `arg` object returns the first `args` if there are any
* **key-value**
  * `--key=value` tagged argument that only sets the argument
  * When a key-value option is stated more than once, all values are saved under `args`.

  
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

## design

Errors are only thrown in these cases:
* any argument containts `__proto__`  *to prevent prototype pollution*
* key-value pair with missing key or value, eg: `--store=` or `--=pet`

However the user can still input things you might not want, for example multiple plain arguments.

To handle your specific cases, everying that is saved in `args`, `opt` and `plain` should be sufficient. If you discover a scenario that can't be handled, please do open an issue/pr :)

Clia options are intended to flag things as true. Eg use `--silent` instead of `--no-output`

Defaults aren't included in clia, as all the number of ways to parse/use defaults would result in an api that is harder to use than just having the consumer setup his own defaults. _(consider for example supporting `docker run --rm -it -v ${pwd}:/temp` and `git pull -r`)_

## references

[The Art of Unix Programming](http://www.catb.org/~esr/writings/taoup/html/ch10s05.html)

[GNU argument syntax conventions](https://www.gnu.org/software/libc/manual/html_node/Argument-Syntax.html)

[getopts](https://github.com/jorgebucaran/getopts#readme) (therefore [this IEEE doc](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html#tag_12_02))
