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
Ator is right that par2 is a better program than par1.
THis is because par2 computes with intervals that are guaranteed to be within 0.5% of the correct value,
whilst par1 computes with intervals that are guaranteed only to be within 0.5% of the correct value
if the values of the actual resistances are within 0.5% of the nominal values.
par2 is better because it is more robust to errors in the nominal values of the resistances.
*/
