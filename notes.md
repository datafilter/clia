    # (except for __proto__) return errors object instead of throwing exceptions?

    # test if multiple flags, does it tag?
    cli -a thing -bc other things
    $a: [thing]
    $c: [other, things]

    # decide and diffrentiate between letter flag, word, option, argument, long option, arg etc..
    cli a -b --c --d=e
    a: argument/text?
    b: letter flag
    c: long flag
    d: long argument?
    e: value/text?