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

function mystery(x) {
    function loop(x, y) {
        if (x === null) {
            return y;
        } else {
            const temp = tail(x);
            set_tail(x, y);
            return loop(temp, x);
        }
    }
    return loop(x, null);
}

const set_to_wow = (x) => {
    let new_pair = get_new_pair();
    let head_x = head(x);
    set_head(head_x, "wow");
    set_head(new_pair, head_x);
    set_tail(new_pair, tail(x));
    return new_pair;
}

const is_pair = (x) => Array.isArray(x) && x.length === 2;

function count_pairs(x) {
    const set1 = new Set();
    const count_array = [x];
    var count = 0;
    while (count_array.length > 0) {
        var current = count_array.pop();
        if (is_pair(current) && set1.has(current) === false) {
            set1.add(current);
            count_array.push(head(current));
            count_array.push(tail(current));
            count = count + 1;
        }
    }
    return count;
}

const has_cycle = (x) => {
    var hare = x;
    var tortoise = x;
    while (true) {
        if (hare === null || tail(hare) === null) {
            return false;
        } else if (hare === tortoise || hare === tail(tortoise)) {
            return true;
        } else {
            hare = tail(tail(hare));
            tortoise = tail(tortoise);
        }
    }
}

const x = pair(1, 2);
const z = pair(x, x);
set_head(tail(z), 17);
console.log(head(x));
/*
Box and pointer diagram for x
1 *-> 2 *-> null

Box and pointer diagram for z
x *-> x *-> null

Box and pointer diagram for tail(z)
x *-> null

Box and pointer diagram for set_head(tail(z), 17)
17 *-> null
*/
