/*
let expr_recursive_machine = make_machine(
    ['n', 'b', 'result'],
    {
        '*': (a, b) => a * b,
        '===': (a, b) => a === b,
        '-': (a, b) => a - b
    },
    controller([
        assign('n', reg('n_val')),
        assign('b', reg('b_val')),
        assign('result', constant(1)),
        label('test_n'),
        test([op('==='), reg('n'), constant(0)]),
        branch(label('done')),
        assign('result', [op('*'), reg('b'), reg('result')]),
        assign('n', [op('-'), reg('n'), constant(1)]),
        goto(label('test_n')),
        label('done')
    ])
);
set_register_contents(expr_recursive_machine, 'n_val', 3);
set_register_contents(expr_recursive_machine, 'b_val', 2);
start(expr_recursive_machine);
let result = get_register_contents(expr_recursive_machine, 'result');
console.log(result); // Should be 8

let expr_iterative_machine = make_machine(
    ['counter', 'b', 'product'],
    {
        '*': (a, b) => a * b,
        '===': (a, b) => a === b,
        '-': (a, b) => a - b
    },
    controller([
        assign('counter', reg('n_val')),
        assign('product', constant(1)),
        assign('b', reg('b_val')),
        label('expr_iter'),
        test([op('==='), reg('counter'), constant(0)]),
        branch(label('done')),
        assign('product', [op('*'), reg('b'), reg('product')]),
        assign('counter', [op('-'), reg('counter'), constant(1)]),
        goto(label('expr_iter')),
        label('done')
    ])
);

set_register_contents(expr_iterative_machine, 'n_val', 3);
set_register_contents(expr_iterative_machine, 'b_val', 2);
start(expr_iterative_machine);
let resultIter = get_register_contents(expr_iterative_machine, 'product');
console.log(resultIter); // Should be 8
*/
