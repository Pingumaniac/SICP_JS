const pair = (x, y) => { return m => m(x, y); }
const head = z => { return z((p, q) => p); }
const tail = z => { return z((p, q) => q); }
function make_interval(x, y) { return pair(x, y); }
function lower_bound(x) { return head(x); }
function upper_bound(x) { return tail(x); }
