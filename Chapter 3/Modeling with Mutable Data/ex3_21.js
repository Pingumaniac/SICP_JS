function pair(x, y) {
    function set_x(v) { x = v; }
    function set_y(v) { y = v; }
    return m => m === "head" ? x : m === "tail" ? y : m === "set_head" ? set_x :
    m === "set_tail" ? set_y : error(m, "Unknown request -- pair");
}
function head(z) { return z("head"); }
function tail(z) { return z("tail"); }
function set_head(z, new_value) { z("set_head")(new_value); return z;}
function set_tail(z, new_value) { z("set_tail")(new_value); return z; }
function append(x, y) { return x === null ? y : pair(head(x), append(tail(x), y)); }
function append_mutator(x, y) { set_tail(last_pair(x), y); return x; }
function last_pair(x) { return tail(x) === null ? x : last_pair(tail(x)); }
function list(x, y) { return pair(x, pair(y, null)); }
function get_new_pair() { return [null, null]; }
function make_cycle(x) { set_tail(last_pair(x), x); return x; }

function front_ptr(queue) { return head(queue); }
function rear_ptr(queue) { return tail(queue); }
function set_front_ptr(queue, item) { set_head(queue, item); }
function set_rear_ptr(queue, item) { set_tail(queue, item); }
function make_queue() { return pair(null, null); }
function is_empty_queue(queue) { return front_ptr(queue) === null; }
function front_queue(queue) {
    return is_empty_queue(queue)
        ? error(queue, "front_queue called with an empty queue")
        : head(front_ptr(queue));
}
function insert_queue(queue, item) {
    const new_pair = pair(item, null);
    if (is_empty_queue(queue)) {
        set_front_ptr(queue, new_pair);
        set_rear_ptr(queue, new_pair);
    } else {
        set_tail(rear_ptr(queue), new_pair);
        set_rear_ptr(queue, new_pair);
    }
    return queue;
}
function delete_queue(queue) {
    if (is_empty_queue(queue)) {
        error(queue, "delete_queue called with an empty queue");
    } else {
        set_front_ptr(queue, tail(front_ptr(queue)));
        return queue;
    }
}

// ex 3.21
function print_queue(queue) {
    let current = front_ptr(queue);
    let result = [];
    while (current !== null) {
        result.push([head(current), null]);
        current = tail(current);
    }
    console.log(result);
}


const q1 = make_queue();
insert_queue(q1, "a");
print_queue(q1); // [["a", null], ["a", null]]
insert_queue(q1, "b");
print_queue(q1); // [["a", ["b", null]], ["b", null]]
delete_queue(q1);
print_queue(q1); // [["b", null], ["b", null]]
delete_queue(q1);
print_queue(q1); // [["b", null], ["b", null]]
// end of ex 3.21
