// controller for Fig 5.11 A recusive factorial machine
controller(
    [
        assign("continue", label(fact_done)),
    "fact_loop",
        test([op("="), reg("n"), constant(1)]),
        branch(label("base_case")),
        save("continue"),
        save("n"),
        assign("n", [op("-", reg("n"), constant(1))]),
        assign("continue", label("after_fact")),
        go_to(label("fact_loop")),
    "after_fact",
        restore("n"),
        restore("continue"),
        assign("val", [op("*"), reg("n"), reg("val")]),
        go_to(reg("continue")),
    "base_case",
        assign("val", constant(1)),
        go_to(reg("continue")),
    "fact_done"
    ]
)
