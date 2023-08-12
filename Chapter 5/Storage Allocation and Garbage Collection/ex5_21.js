function pair(x, y) { const fresh = get_new_pair(); set_head(fresh, x); set_tail(fresh, y); return fresh; }
function last_pair(x) { return tail(x) === null ? x : last_pair(tail(x)); }
function list(x, y) { return pair(x, pair(y, null)); }
function get_new_pair() { return [null, null]; }
function set_head(pair, value) { pair[0] = value; }
function set_tail(pair, value) { pair[1] = value; }
function head(pair) { return pair[0]; }
function tail(pair) { return pair[1]; }

function append(x, y) { return x === null ? y : pair(head(x), append(tail(x), y)); }

// register machine for append
data_path(
    registers(
        ["x", "y", "result"]
    )
)
controller(
    [
    "append_loop",
        test([op("==="), reg("x"), constant(null)]),
        branch(label("x_is_null")),
        save("y"),
        save("result"),
        assign("result", [op("pair"), reg("head", reg("x")), reg("result")]),
        assign("x", [op("tail"), reg("x")]),
        go_to(label("append_loop")),
    "x_is_null",
        assign("result", reg("y")),
        restore("result"),
        restore("y"),
        go_to(label("end")),
    "end"
    ]
)

function append_mutator(x, y) { set_tail(last_pair(x), y); return x; }

// register machine for append_mutator
data_path(
    registers(
        ["x", "y"]
    )
)
controller(
    [
    "append_mutator_loop",
        test([op("==="), [op("tail"), reg("x")], constant(null)]),
        branch(label("x_is_last_pair")),
        assign("x", [op("tail"), reg("x")]),
        go_to(label("append_mutator_loop")),
    "x_is_last_pair",
        perform([op("set_tail"), reg("x"), reg("y")]),
        assign("result", reg("x")),
    "end"
    ]
)
