### 2020.8.11

* key-value parsing no longer throws error
* entire rhs of key-value = symbol is saved in value
* also reject 'prototype' argument/options

### 2020.8.10

* empty or non-string inputs are ignored.
* trim spaces around inputs

### 2020.8.9

* remove unhandled kind throw
* improved error for unexpected input

### 2020.8.8

* throw on __proto__ argument even after `--`

### 2020.8.7

* Optional alias to options and arguments
* Save first tagged argument in arg property
* Save all key value arguments in args property
* Save all untagged arguments in plain property

### 2020.8.6

* `--` marks all subsequent inputs as arguments

### 2020.8.5

* Allow single `-` character as argument
* Allow `$` character as option