### 2024.5.31

* Make invalid arguments error message more direct 

### 2024.5.29

* No functional changes - update docs, linter & ci/cd.

### 2020.8.11

* Set errors in optional property instead of throwing
* Entire rhs of key-value = symbol is saved in value
* Reject 'prototype' argument/options

### 2020.8.10

* Empty or non-string inputs are ignored.
* Trim spaces around inputs

### 2020.8.9

* Remove unhandled kind throw
* Improved error for unexpected input

### 2020.8.8

* Throw on __proto__ argument even after `--`

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
