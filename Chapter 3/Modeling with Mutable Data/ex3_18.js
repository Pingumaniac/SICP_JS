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

// ex 3.18
const has_cycle = (x) => {
    const set1 = new Set();
    const count_array = [x];
    while (count_array.length > 0) {
        var current = count_array.pop();
        if (is_pair(current) && set1.has(current) === false) {
            set1.add(current);
            count_array.push(head(current));
            count_array.push(tail(current));
        } else if (is_pair(current) && set1.has(current) === true) {
            return true;
        }
    }
    return false;
}
