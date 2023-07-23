function pair(x, y) { const fresh = get_new_pair(); set_head(fresh, x); set_tail(fresh, y); return fresh; }
function append(x, y) { return x === null ? y : pair(head(x), append(tail(x), y)); }
function append_mutator(x, y) { set_tail(last_pair(x), y); return x; }
function last_pair(x) { return tail(x) === null ? x : last_pair(tail(x)); }
function list(x, y) { return pair(x, pair(y, null)); }
function get_new_pair() { return [null, null]; }
function set_head(pair, value) { pair[0] = value; }
function set_tail(pair, value) { pair[1] = value; }
function head(pair) { return pair[0]; }
function tail(pair) { return pair[1]; }
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

// ex 3.16
const is_pair = (x) => Array.isArray(x) && x.length === 2;

function count_pairs(x) {
    return is_pair(x) === false ? 0 : 1 + count_pairs(head(x)) + count_pairs(tail(x));
}

const list_three_elements = pair(1, pair(2, pair(3, null)));
const p = pair(1, null);
const list_four_elements = pair(1, pair(p, p));
const list_seven_elements = pair(p, pair(p, pair(p, p)));
console.log(count_pairs(list_three_elements));
/*
Box and pointer diagram for list_three_elements
1 *-> 2 *-> 3 *-> null
*/
console.log(count_pairs(list_four_elements));
/*
Box and pointer diagram for list_four_elements
1 *--> null
        *
        |
        V
        1 *--> null
*/
console.log(count_pairs(list_seven_elements));
/*
Box and pointer diagram for list_seven_elements
1 *-> null
       *
       |
       V
       1 *-> null
               *
               |
               V
               1 *-> 1 *-> null
                     *
                     |
                     V
                     1 *-> null
*/
