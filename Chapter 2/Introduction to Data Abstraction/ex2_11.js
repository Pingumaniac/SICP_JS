const pair = (x, y) => { return m => m(x, y); }
const head = z => { return z((p, q) => p); }
const tail = z => { return z((p, q) => q); }
function make_interval(x, y) { return pair(x, y); }
function lower_bound(x) { return head(x); }
function upper_bound(x) { return tail(x); }
function add_interval(x, y) {
    return make_interval(lower_bound(x) + lower_bound(y),
                         upper_bound(x) + upper_bound(y));
}

const mul_interval = (x, y) => {
    const x1 = lower_bound(x);
    const x2 = upper_bound(x);
    const y1 = lower_bound(y);
    const y2 = upper_bound(y);
    if (x2 < 0) {
        return y2 < 0 ? make_interval(x2 * y2, x1 * y1) : y1 < 0 ? make_interval(x1 * y2, x2 * y1) : make_interval(x1 * y2, x1 * y1);
    } else if (x1 < 0) {
        return y2 < 0 ? make_interval(x2 * y1, x1 * y2) : y1 < 0 ? make_interval(x1 * y1, x2 * y2) : make_interval(x2 * y1, x2 * y2);
    } else {
        return y2 < 0 ? make_interval(x2 * y1, x1 * y1) : y1 < 0 ? make_interval(x1 * y2, x2 * y2) : make_interval(Math.min(x1 * y2, x2 * y1), Math.max(x1 * y1, x2 * y2));
    }
}

function div_interval(x, y) {
    if (y === 0) {
        return "Division by zero";
    }
    return mul_interval(x, make_interval(1 / upper_bound(y), 1 / lower_bound(y)));
}

const sub_interval = (x, y) => {
    return make_interval(lower_bound(x) - upper_bound(y),
                         upper_bound(x) - lower_bound(y));
}
