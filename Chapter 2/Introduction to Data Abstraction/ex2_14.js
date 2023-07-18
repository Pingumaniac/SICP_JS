const pair = (x, y) => { return m => m(x, y); }
const head = z => { return z((p, q) => p); }
const tail = z => { return z((p, q) => q); }
const make_interval = (x, y) => { return pair(x, y); }
const lower_bound = (x) => { return head(x); }
const upper_bound = (x) => { return tail(x); }
const add_interval = (x, y) => { return make_interval(lower_bound(x) + lower_bound(y), upper_bound(x) + upper_bound(y)); }
const mul_interval = (x, y) => {
    const p1 = lower_bound(x) * lower_bound(y);
    const p2 = lower_bound(x) * upper_bound(y);
    const p3 = upper_bound(x) * lower_bound(y);
    const p4 = upper_bound(x) * upper_bound(y);
    return make_interval(Math.min(p1, p2, p3, p4),
                         Math.max(p1, p2, p3, p4));
}

const div_interval = (x, y) => { return y === 0 ? "Division by zero" : mul_interval(x, make_interval(1 / upper_bound(y), 1 / lower_bound(y))); }
const sub_interval = (x, y) => { return make_interval(lower_bound(x) - upper_bound(y), upper_bound(x) - lower_bound(y)); }
const make_center_width = (c, w) => { return make_interval(c - w, c + w); }
const center = (i) => { return (lower_bound(i) + upper_bound(i)) / 2; }
const width = (i) => { return (upper_bound(i) - lower_bound(i)) / 2; }
const percent_tolerance = (i) => { return width(i) / center(i) * 100; }

const make_center_percent = (center, percent_tolerance) => {
    const width = center * percent_tolerance / 100;
    return make_center_width(center, width);
}

function par1(r1, r2) {
    return div_interval(mul_interval(r1, r2), add_interval(r1, r2));
}
function par2(r1, r2) {
    const one = make_interval(1, 1);
    return div_interval(one, add_interval(div_interval(one, r1), div_interval(one, r2)));
}

/*
Lem is right that par1 and par2 can give different answers.
This is because par1 is not symmetric, while par2 is.
For instance, if r1 = [1, 2] and r2 = [1, 1], then par1(r1, r2) = [0.5, 1],
but par1(r2, r1) = [0.333, 0.5].
On the other hand, par2(r1, r2) = [0.5, 1] and par2(r2, r1) = [0.5, 1].

par1 is not symmetric because the order of the arguments matters.
par2 is symmetric because the order of the arguments does not matter.

par1 is not associative because (par1(r1, r2), r3) is not the same as (r1, par1(r2, r3)).
For instance, if r1 = [1, 2], r2 = [1, 1], and r3 = [1, 1], then
par1(par1(r1, r2), r3) = par1([0.5, 1], [1, 1]) = [0.333, 0.5],
but par1(r1, par1(r2, r3)) = par1([1, 2], [0.5, 1]) = [0.5, 1].

par2 is associative because (par2(r1, r2), r3) is the same as (r1, par2(r2, r3)).
For instance, if r1 = [1, 2], r2 = [1, 1], and r3 = [1, 1], then
par2(par2(r1, r2), r3) = par2([0.5, 1], [1, 1]) = [0.5, 1],
and par2(r1, par2(r2, r3)) = par2([1, 2], [0.5, 1]) = [0.5, 1].

par1 is not commutative because par1(r1, r2) is not the same as par1(r2, r1).
For instance, if r1 = [1, 2] and r2 = [1, 1], then par1(r1, r2) = [0.5, 1],
*/
