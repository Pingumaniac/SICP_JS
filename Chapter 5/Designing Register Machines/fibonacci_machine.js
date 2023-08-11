// controller for Fig 5.12 A machine to compute Fibonacci numbers
controller(
    [
        assign("continue", label(fib_done)),
    "fib_loop",
        test([op("<"), reg("n"), constant(2)]),
        branch(label("immediate_answer")),
        save("continue"),
        assign("continue", label("afterfib_n_1")),
        save("n"),
        assign("n", [op("-", reg("n"), constant(1))]),
        go_to(label("fib_loop")),
    "afterfib_n_1",
        restore("n"),
        restore("continue"),
        assign("n", [op("-", reg("n"), constant(2))]),
        save("continue"),
        assign("continue", label("afterfib_n_2")),
        go_to(label("fib_loop")),
    "afterfib_n_2",
        assign("n", reg("val")),
        restore("val"),
        restore("continue"),
        assign("val", [op("+"), reg("n"), reg("val")]),
        go_to(reg("continue")),
    "immediate_answer",
        assign("val", reg("n")),
        go_to(reg("continue")),
    "fib_done"
    ]
)
