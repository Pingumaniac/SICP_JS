function expr(b, n) { return n === 0 ? 1 : b * expr(b, n - 1); }
/*
corresponding register machine:

controller(
    [
        assign("n", reg("n_val")),
        assign("b", reg("b_val")),
        assign("result", constant(1)),
        label("test_n"),
        test([op("==="), reg("n"), constant(0)]),
        branch(label("done")),
        assign("result", [op("*"), reg("b"), reg("result")]),
        assign("n", [op("-"), reg("n"), constant(1)]),
        goto(label("test_n")),
        label("done")
    ]
);
*/

function expr_iterative(b, n) {
    function expr_iter(counter, product) {
        return counter === 0 ? product : expr_iter(counter - 1, b * product);
    }
    return expr_iter(n, 1);
}

/*
corresponding register machine:

controller(
    [
        assign("counter", reg("n_val")),
        assign("product", constant(1)),
        assign("b", reg("b_val")),
        label("expr_iter"),
        test([op("==="), reg("counter"), constant(0)]),
        branch(label("done")),
        assign("product", [op("*"), reg("b"), reg("product")]),
        assign("counter", [op("-"), reg("counter"), constant(1)]),
        goto(label("expr_iter")),
        label("done")
    ]
);
*/
