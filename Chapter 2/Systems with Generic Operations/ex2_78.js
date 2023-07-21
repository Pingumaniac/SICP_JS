function Pair(left, right) { this.left = left; this.right = right; }
const head = (items) => { return items === null || items === undefined ? null : items.left; }
const tail = (items) => { return items === null || items === undefined ? null : items.right; }
const list = (...items) => { return items.length === 0 ? null : new Pair(items[0], list(...items.slice(1))); }
const for_each = (f, list) => { return list === null ? null : new Pair(f(head(list)), for_each(f, tail(list))); }
const pair = (x, y) => { return new Pair(x, y); }
const is_pair = (x) => { return x instanceof Pair; }
const map = (f, sequence) => { return accumulate((x, y) => pair(f(x), y), null, sequence); }
const append = (seq1, seq2) => { return accumulate(pair, seq2, seq1); }
const length = (sequence) => { return accumulate((x, y) => y + 1, 0, sequence); }
const enumerate_interval = (low, high) => { return low > high ? null : pair(low, enumerate_interval(low + 1, high)) }

const print_list = (list) => {
    if (list === null) {
        return '';
    } else if (head(list) instanceof Pair) {
        return '(' + print_list(head(list)) + ') ' + print_list(tail(list));
    } else {
        return head(list) + ' ' + print_list(tail(list));
    }
};
const filter = (predicate, sequence) => {
    return sequence === null ? null : predicate(head(sequence)) ? pair(head(sequence), filter(predicate, tail(sequence))) : filter(predicate, tail(sequence));
}
const accumulate = (op, initial, sequence) => {
    return sequence === null ? initial : op(head(sequence), accumulate(op, initial, tail(sequence)));
}
const remove = (item, sequence) => {
    return sequence === null ? null : item === head(sequence) ? tail(sequence) : pair(head(sequence), remove(item, tail(sequence)));
}
const member = (item, x) => {
    return x === null ? false : item === head(x) ? true : member(item, tail(x));
}
const equal = (list1, list2) => {
    if (list1 === null && list2 === null) {
        return true;
    } else if (list1 === null || list2 === null) {
        return false;
    } else if (head(list1) instanceof Pair && head(list2) instanceof Pair) {
        return equal(head(list1), head(list2)) && equal(tail(list1), tail(list2));
    } else {
        return head(list1) === head(list2) && equal(tail(list1), tail(list2));
    }
}

const attach_tag = (tag, contents) => { return pair(tag, contents); }
const is_rectangular = (z) => { return type_tag(z) === "rectangular"; }
const is_polar = (z) => { return type_tag(z) === "polar"; }

const apply_generic = (op, args) => { return head(args)(op); }
const make_from_mag_ang = (r, a) => { return attach_tag("polar", pair(r, a)); }
const make_from_real_imag = (x, y) => { return attach_tag("rectangular", pair(x, y)); }

const real_part = (z) => { return apply_generic("real_part", list(z)); }
const imag_part = (z) => { return apply_generic("imag_part", list(z)); }
const magnitude = (z) => { return apply_generic("magnitude", list(z)); }
const angle = (z) => { return apply_generic("angle", list(z)); }


// Ben's representation of complex numbers (rectangular form)
const real_part_rectangular = (z) => { return head(z); }
const imag_part_rectangular = (z) => { return tail(z); }
const magnitude_rectangular = (z) => { return Math.sqrt(real_part_rectangular(z) * real_part_rectangular(z) + imag_part_rectangular(z) * imag_part_rectangular(z)); }
const angle_rectangular = (z) => { return Math.atan2(imag_part_rectangular(z), real_part_rectangular(z)); }
const make_from_real_imag_rectangular = (x, y) => { return pair(x, y); }
const make_from_mag_ang_rectangular = (r, a) => { return pair(r * Math.cos(a), r * Math.sin(a)); }

// Alyssa's representation of complex numbers (polar form)
const real_part_polar = (z) => { return magnitude_polar(z) * Math.cos(angle(z)); }
const imag_part_polar = (z) => { return magnitude_polar(z) * Math.sin(angle(z)); }
const magnitude_polar = (z) => { return head(z); }
const angle_polar = (z) => { return tail(z); }
const make_from_real_imag_polar = (x, y) => { return pair(Math.sqrt(x * x + y * y), Math.atan2(y, x)); }
const make_from_mag_ang_polar = (r, a) => { return pair(r, a); }

const install_rectangular_package = () => {
    const real_part = (z) => { return head(z); }
    const imag_part = (z) => { return tail(z); }
    const make_from_real_imag = (x, y) => { return pair(x, y); }
    const magnitude = (z) => { return Math.sqrt(real_part(z) * real_part(z) + imag_part(z) * imag_part(z)); }
    const angle = (z) => { return Math.atan2(imag_part(z), real_part(z)); }
    const make_from_mag_ang = (r, a) => { return pair(r * Math.cos(a), r * Math.sin(a)); }
    const tag = (z) => { return attach_tag("rectangular", z); }
    put("real_part", list("rectangular"), real_part);
    put("imag_part", list("rectangular"), imag_part);
    put("magnitude", list("rectangular"), magnitude);
    put("angle", list("rectangular"), angle);
    put("make_from_real_imag", list("rectangular"), (x, y) => { return tag(make_from_real_imag(x, y)); });
    put("make_from_mag_ang", list("rectangular"), (r, a) => { return tag(make_from_mag_ang(r, a)); });
    return "done";
}

const install_polar_package = () => {
    const magnitude = (z) => { return head(z); }
    const angle = (z) => { return tail(z); }
    const make_from_mag_ang = (r, a) => { return pair(r, a); }
    const real_part = (z) => { return magnitude(z) * Math.cos(angle(z)); }
    const imag_part = (z) => { return magnitude(z) * Math.sin(angle(z)); }
    const make_from_real_imag = (x, y) => { return pair(Math.sqrt(x * x + y * y), Math.atan2(y, x)); }
    const tag = (z) => { return attach_tag("polar", z); }
    put("real_part", list("polar"), real_part);
    put("imag_part", list("polar"), imag_part);
    put("magnitude", list("polar"), magnitude);
    put("angle", list("polar"), angle);
    put("make_from_real_imag", list("polar"), (x, y) => { return tag(make_from_real_imag(x, y)); });
    put("make_from_mag_ang", list("polar"), (r, a) => { return tag(make_from_mag_ang(r, a)); });
    return "done"
}

const add = (x, y) => { return apply_generic("add", list(x, y)); }
const sub = (x, y) => { return apply_generic("sub", list(x, y)); }
const mul = (x, y) => { return apply_generic("mul", list(x, y)); }
const div = (x, y) => { return apply_generic("div", list(x, y)); }

const install_javascript_number_package = () => {
    const tag = (x) => { return attach_tag("javascript_number", x); }
    put("add", list("javascript_number", "javascript_number"), (x, y) => { return tag(x + y); });
    put("sub", list("javascript_number", "javascript_number"), (x, y) => { return tag(x - y); });
    put("mul", list("javascript_number", "javascript_number"), (x, y) => { return tag(x * y); });
    put("div", list("javascript_number", "javascript_number"), (x, y) => { return tag(x / y); });
    put("make", "javascript_number", (x) => { return tag(x); });
    return "done";
}

const make_javascript_number = (n) => { return get("make", "javascript_number")(n); }

const install_rational_package = () => {
    const numer = (x) => { return head(x); }
    const denom = (x) => { return tail(x); }
    const add_rat = (x, y) => { return make_rat(add(mul(numer(x), denom(y)), mul(numer(y), denom(x))), mul(denom(x), denom(y))); }
    const sub_rat = (x, y) => { return make_rat(sub(mul(numer(x), denom(y)), mul(numer(y), denom(x))), mul(denom(x), denom(y))); }
    const mul_rat = (x, y) => { return make_rat(mul(numer(x), numer(y)), mul(denom(x), denom(y))); }
    const div_rat = (x, y) => { return make_rat(mul(numer(x), denom(y)), mul(denom(x), numer(y))); }
    const tag = (x) => { return attach_tag("rational", x); }
    put("add", list("rational", "rational"), (x, y) => { return tag(add_rat(x, y)); });
    put("sub", list("rational", "rational"), (x, y) => { return tag(sub_rat(x, y)); });
    put("mul", list("rational", "rational"), (x, y) => { return tag(mul_rat(x, y)); });
    put("div", list("rational", "rational"), (x, y) => { return tag(div_rat(x, y)); });
    put("make", "rational", (n, d) => { return tag(make_rat(n, d)); });
    return "done";
}

const make_rational = (n, d) => { return get("make", "rational")(n, d); }

const install_complex_package = () => {
    const make_from_real_imag = (x, y) => { return attach_tag("complex_from_real_imag", pair(x, y)); }
    const make_from_mag_ang = (r, a) => { return attach_tag("complex_from_mag_ang", pair(r, a)); }
    const add_complex = (z1, z2) => { return make_from_real_imag(real_part(z1) + real_part(z2), imag_part(z1) + imag_part(z2)); }
    const sub_complex = (z1, z2) => { return make_from_real_imag(real_part(z1) - real_part(z2), imag_part(z1) - imag_part(z2)); }
    const mul_complex = (z1, z2) => { return make_from_mag_ang(magnitude(z1) * magnitude(z2), angle(z1) + angle(z2)); }
    const div_complex = (z1, z2) => { return make_from_mag_ang(magnitude(z1) / magnitude(z2), angle(z1) - angle(z2)); }
    const tag = (x) => { return attach_tag("complex", x); }
    put("add", list("complex", "complex"), (x, y) => { return tag(add_complex(x, y)); });
    put("sub", list("complex", "complex"), (x, y) => { return tag(sub_complex(x, y)); });
    put("mul", list("complex", "complex"), (x, y) => { return tag(mul_complex(x, y)); });
    put("div", list("complex", "complex"), (x, y) => { return tag(div_complex(x, y)); });
    put("make_from_real_imag", "complex", (x, y) => { return tag(make_from_real_imag(x, y)); });
    put("make_from_mag_ang", "complex", (r, a) => { return tag(make_from_mag_ang(r, a)); });
    put("real_part", list("complex"), real_part);
    put("imag_part", list("complex"), imag_part);
    put("magnitude", list("complex"), magnitude);
    put("angle", list("complex"), angle);
    return "done";
}

const make_complex_from_real_imag = (x, y) => { return get("make_from_real_imag", "complex")(x, y); }
const make_complex_from_mag_ang = (r, a) => { return get("make_from_mag_ang", "complex")(r, a); }

// ex.2.78
// modify type_tag and contents so that our generic system takes advantage of javascript's type system
const type_tag = (datum) => { return typeof datum; }
const contents = (datum) =>  { return datum; }
