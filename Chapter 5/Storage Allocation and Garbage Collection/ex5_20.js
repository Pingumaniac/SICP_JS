function is_pair(x) { return x === null && x.length === 2; }
function count_leaves(tree) {
    return tree === null ? 0 : !is_pair(tree) ? 1 : count_leaves(tree[0]) + count_leaves(tree[1]);
}

// register machine for count_leaves
data_path(
    registers(
        ["tree", "result"]
    )
)
controller(
    [
        assign("result", constant(0)),
    "count_leaves_loop",
        test([op("==="), reg("tree"), constant(null)]),
        branch(label("if_null")),
        test([op("is_pair"), reg("tree")]),
        branch(label("if_not_pair")),
        assign("tree", [op("head"), reg("tree")]),
        go_to(label("count_leaves_loop")),
        assign("result", [op("+"), reg("result"), constant(1)]),
        assign("tree", [op("tail"), reg("tree")]),
        go_to(label("count_leaves_loop")),
    "if_null",
        go_to(label("end")),
    "if_not_pair",
        assign("result", [op("+"), reg("result"), constant(1)]),
    "end"
    ]
)

function count_leaves_2(tree) {
    function count_iter(tree, n){
        return tree === null ? n : !is_pair(tree) ? n + 1 : count_iter(tree[0], count_iter(tree[1], n));
    }
    return count_iter(tree, 0);
}

// register machine for count_leaves_2
data_path(
    registers(
        ["tree", "result"]
    )
)
controller(
    [
        assign("n", constant(0)),
    "count_leaves_2_loop",
        test([op("==="), reg("tree"), constant(null)]),
        branch(label("if_null")),
        test([op("is_pair"), reg("tree")]),
        branch(label("if_not_pair")),
        assign("tree", [op("head"), reg("tree")]),
        go_to(label("count_leaves_2_loop")),
        assign("n", [op("+"), reg("n"), constant(1)]),
        assign("tree", [op("tail"), reg("tree")]),
        go_to(label("count_leaves_2_loop")),
    "if_null",
        assign("result", reg("n")),
        go_to(label("end")),
    "if_not_pair",
        assign("result", [op("+"), reg("n"), constant(1)]),
    "end"
    ]
)
