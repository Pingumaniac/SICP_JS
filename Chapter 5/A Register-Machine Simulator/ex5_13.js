// This is how the factorial machine can be modified

controller(
    [
        perform(make_stack().initialize), // Change: initialize the stack
        assign("continue", label("fact_done")),
    "fact_loop",
        test([op("="), reg("n"), constant(1)]),
        branch(label("base_case")),
        perform(save("continue", machine)), // Change: save continue label
        perform(save("n", machine)), // Change: save n
        assign("n", [op("-", reg("n"), constant(1))]),
        assign("continue", label("after_fact")),
        go_to(label("fact_loop")),
    "after_fact",
        perform(restore("n", machine)), // Change: restore n
        perform(restore("continue", machine)), // Change: restore continue label
        assign("val", [op("*"), reg("n"), reg("val")]),
        go_to(reg("continue")),
    "base_case",
        assign("val", constant(1)),
        go_to(reg("continue")),
    "fact_done",
        perform(make_stack().print_statistics) // Change: print the stack statistics
    ]
)

/*
For testing,
start facotiral machines with n = 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
and get register contents of val after each machine stops.

number_pushes and max_depth should be both 2n - 2.
*/

