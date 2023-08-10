function sqrt(x) {
    function is_good_enough(guess) { return Math.abs(guess * guess - x) < 0.001; }
    function improve(guess) { return average(guess, x / guess); }
    function sqrt_iter(guess) { return is_good_enough(guess) ? guess : sqrt_iter(improve(guess)); }
    return sqrt_iter(1.0);
}

/*
ex 5.3 (register machine language of is_good_enough, improve, sqrt).

is_good_enough:
controller(
    [
        assign("temp", [op("*"), reg("guess"), reg("guess")]),
        assign("temp", [op("-"), reg("temp"), reg("x")]),
        assign("temp", [op("Math.abs"), reg("temp")]),
        test([op("<"), reg("temp"), constant(0.001)])
    ]
);

improve:
controller(
    [
        assign("temp", [op("+"), reg("guess"), [op("/"), reg("x"), reg("guess")]]),
        assign("guess", [op("/"), reg("temp"), constant(2)])
    ]
);

full version:
controller(
    [
        assign("x", reg("x_value")),
        assign("guess", constant(1.0)),
        label("test_guess"),
        assign("temp", [op("-"), [op("*"), reg("guess"), reg("guess")], reg("x")]),
        assign("temp", [op("abs"), reg("temp")]),
        test([op("<"), reg("temp"), constant(0.001)]),
        branch(label("sqrt_done")),
        assign("temp", [op("+"), reg("guess"), [op("/"), reg("x"), reg("guess")]]),
        assign("guess", [op("/"), reg("temp"), constant(2)]),
        goto(label("test_guess")),
        label("sqrt_done")
    ]
);

Note that the data-path diagram part have been skipped due to complexity of drawing.
*/
