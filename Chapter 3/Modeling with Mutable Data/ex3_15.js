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
function set_head(pair, value) { pair[0] = value; }
function set_tail(pair, value) { pair[1] = value; }
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

// ex 3.15
const set_to_wow = (x) => {
    let new_pair = get_new_pair();
    let head_x = head(x);
    set_head(head_x, "wow");
    set_head(new_pair, head_x);
    set_tail(new_pair, tail(x));
    return new_pair;
}

const x = list("a", "b");
const z1 = pair(x, x);
const z2 = pair(list("a", "b"), list("a", "b"));

console.log(JSON.stringify(z1)); // [[ "a", [ "b", null ]], [ "a", [ "b", null ]]]
console.log(JSON.stringify(set_to_wow(z1))); // [[ "wow", [ "b", null ]], [ "wow", [ "b", null ]]]
/*
Box and pointer diagram for set_to_wow(z1)
wow *-> b *-> null
*
|
V
wow *-> b *-> null
*/
console.log(JSON.stringify(z2)); // [[ "a", [ "b", null ]], [ "a", [ "b", null ]]]
console.log(JSON.stringify(set_to_wow(z2))); // [[ "wow", [ "b", null ]], [ "a", [ "b", null ]]]
/*
Box and pointer diagram for set_to_wow(z2)
wow *-> b *-> null
*
|
V
a *-> b *-> null
*/

