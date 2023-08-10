function factorial(n) {
    function iter(product, counter) {
        return counter > n ? product : iter(counter * product, counter + 1);
    }
    return iter(1, 1);
}

/*
ex 5.2 (register machine language of factorial)

controller(
    [
        assign("product", constant(1)),
        assign("counter", constant(1)),
        label("test_n"),
        test([op(">"), reg("counter"), reg("n")]),
        branch(label("done")),
        assign("t", [op("*"), reg("product"), reg("counter")]),
        assign("product", reg("t")),
        assign("t", [op("+"), reg("counter"), constant(1)]),
        assign("counter", reg("t")),
        goto(label("test_n")),
        label("done")
    ]
);
*/

