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
function mul_interval(x, y) {
    const p1 = lower_bound(x) * lower_bound(y);
    const p2 = lower_bound(x) * upper_bound(y);
    const p3 = upper_bound(x) * lower_bound(y);
    const p4 = upper_bound(x) * upper_bound(y);
    return make_interval(Math.min(p1, p2, p3, p4),
                         Math.max(p1, p2, p3, p4));
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


function make_center_width(c, w) {
    return make_interval(c - w, c + w);
}
function center(i) {
    return (lower_bound(i) + upper_bound(i)) / 2;
}
function width(i) {
    return (upper_bound(i) - lower_bound(i)) / 2;
}

const percent_tolerance = (i) => {
    return width(i) / center(i) * 100;
}

const make_center_percent = (center, percent_tolerance) => {
    const width = center * percent_tolerance / 100;
    return make_center_width(center, width);
}

