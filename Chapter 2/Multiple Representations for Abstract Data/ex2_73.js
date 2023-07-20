function Pair(left, right) { this.left = left; this.right = right; }
const head = (items) => { return items === null || items === undefined ? null : items.left; }
const tail = (items) => { return items === null || items === undefined ? null : items.right; }
const list = (...items) => { return items.length === 0 ? null : new Pair(items[0], list(...items.slice(1))); }
const for_each = (f, list) => { return list === null ? null : new Pair(f(head(list)), for_each(f, tail(list))); }
const pair = (x, y) => { return new Pair(x, y); }
const is_pair = (x) => { return x instanceof Pair; }
const make_mobile = (left, right) => { return pair(left, right); }
const make_branch = (length, structure) => { return pair(length, structure); }
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
const enumerate_tree = (tree) => {
    return tree === null ? null : ! is_pair(tree) ? list(tree) : append(enumerate_tree(head(tree)), enumerate_tree(tail(tree)));
}
const horder_eval = (x, coefficient_sequence) => {
    return accumulate((this_coeff, higher_terms) => x * higher_terms + this_coeff, 0, coefficient_sequence);
}
const accumulate_n = (op, initial, seqs) => {
    return seqs === null ? initial : pair(accumulate(op, initial, map(head, seqs)), accumulate_n(op, initial, map(tail, seqs)));
}
const fold_right = (op, initial, sequence) => {
    return sequence === null ? initial : op(initial, fold_right(op, head(sequence), tail(sequence)));
};
const fold_left = (op, initial, sequence) => {
    const iter = (result, rest) => {
        return rest === null ? result : iter(op(result, head(rest)), tail(rest));
    }
    return iter(initial, sequence);
};
const flat_map = (f, seq) => { return accumulate(append, null, map(f, seq)); }
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

const is_variable = (x) => { return is_string(x); }
const is_same_variable = (v1, v2) => { return is_variable(v1) && is_variable(v2) && v1 === v2; }
const is_sum = (x) => { return is_pair(x) && head(x) === "+"; }
const addend = (s) => { return head(tail(s)); }
const augend = (s) => { return head(tail(tail(s))); }
const is_product = (x) => { return is_pair(x) && head(x) === "*"; }
const multiplier = (p) => { return head(tail(p)); }
const multiplicand = (p) => { return head(tail(tail(p))); }
const make_sum = (a1, a2) => {
    return number_equal (a1, 0) ? a2 : number_equal (a2, 0) ? a1 : is_number(a1) && is_number(a2) ? a1 + a2 : list("+", a1, a2);
}
const number_equal = (a, b) => { return is_number(a) && is_number(b) && a === b; }
const make_product = (m1, m2) => {
    return number_equal(m1, 0) || number_equal(m2, 0) ? 0 : number_equal(m1, 1) ? m2 : number_equal(m2, 1) ? m1 : is_number(m1) && is_number(m2) ? m1 * m2 : list("*", m1, m2);
}
const is_number = (x) => { return typeof x === "number"; }
const is_exp = (x) => { return is_pair(x) && head(x) === "**"; }
const base = (x) => { return head(tail(x)); }
const exponent = (x) => { return head(tail(tail(x))); }
const make_exp = (base, exponent) => { return exponent === 0 ? 1 : exponent === 1 ? base : list("**", base, exponent); }
const is_sine = (x) => { return is_pair(x) && head(x) === "sin"; }
const is_arcsine = (x) => { return is_pair(x) && head(x) === "arcsin"; }
const is_cosine = (x) => { return is_pair(x) && head(x) === "cos"; }
const is_arccosine = (x) => { return is_pair(x) && head(x) === "arccos"; }
const is_tangent = (x) => { return is_pair(x) && head(x) === "tan"; }
const is_arctangent = (x) => { return is_pair(x) && head(x) === "arctan"; }
const is_quotient = (x) => { return is_pair(x) && head(x) === "/"; }
const make_sine = (x) => { return list("sin", x); }
const make_cosine = (x) => { return list("cos", x); }
const make_quotient = (n, d) => { return list("/", n, d); }
const is_parenthesis = (x) => { return is_pair(x) && head(x) === "parenthesis"; }
const make_parenthesis = (x) => { return list("parenthesis", x); }
const omit_parentheses = (x) => { return is_parenthesis(x) ? head(tail(x)) : x; }

const add_complex = (z1, z2) => { return make_from_real_imag(real_part(z1) + real_part(z2), imag_part(z1) + imag_part(z2)); }
const sub_complex = (z1, z2) => { return make_from_real_imag(real_part(z1) - real_part(z2), imag_part(z1) - imag_part(z2)); }
const mul_complex = (z1, z2) => { return make_from_mag_ang(magnitude(z1) * magnitude(z2), angle(z1) + angle(z2)); }
const div_complex = (z1, z2) => { return make_from_mag_ang(magnitude(z1) / magnitude(z2), angle(z1) - angle(z2)); }
const attach_tag = (tag, contents) => { return pair(tag, contents); }
const type_tag = (datum) => { return is_pair(datum) ? head(datum) : error(datum, "bad tagged datum -- type_tag"); }
const cotents = (datum) => { return is_pair(datum) ? tail(datum) : error(datum, "bad tagged datum -- contents"); }
const is_rectangular = (z) => { return type_tag(z) === "rectangular"; }
const is_polar = (z) => { return type_tag(z) === "polar"; }

const apply_generic = (op, args) => {
    const type_tags = map(type_tag, args);
    const fun = get(op, type_tags);
    return !is_undefined(fun) ? apply_in_underlying_javascript(fun, map(contents, args)) : error(list(op, type_tags), "No method for these types in apply_generic");
}
const real_part = (z) => { return apply_generic("real_part", list(z)); }
const imag_part = (z) => { return apply_generic("imag_part", list(z)); }
const magnitude = (z) => { return apply_generic("magnitude", list(z)); }
const angle = (z) => { return apply_generic("angle", list(z)); }
const make_from_real_imag = (x, y) => { return apply_generic("make_from_real_imag", list(x, y)); }
const make_from_mag_ang = (r, a) => { return apply_generic("make_from_mag_ang", list(r, a)); }

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

// ex 2.73
const deriv = (exp, variable) => {
    return is_number(exp) ? 0 : is_variable(exp) ? is_same_variable(exp, variable) ? 1 : 0 :
    // (part b) added sum and product functions and other auxiliary code
    is_sum(exp) ? make_sum(deriv(addend(exp), variable), deriv(augend(exp), variable)) :
    is_product(exp) ? make_sum(make_product(multiplier(exp), deriv(multiplicand(exp), variable)),
    // (part c) added various additional differentiation rules
    make_product(deriv(multiplier(exp), variable), multiplicand(exp))) : is_exponentiation(exp) ?
    make_product(make_product(exponent(exp), make_exponentiation(base(exp), make_sum(exponent(exp), -1))), deriv(base(exp), variable)) :
    is_log(exp) ? make_product(make_product(make_sum(1, -1), deriv(base(exp), variable)), make_exponentiation(base(exp), -1)) :
    is_sine(exp) ? make_product(make_cosine(angle(exp)), deriv(angle(exp), variable)) :
    is_cosine(exp) ? make_product(make_product(-1, make_sine(angle(exp))), deriv(angle(exp), variable)) :
    is_tangent(exp) ? make_product(make_product(make_sum(1, -1), make_exponentiation(make_tangent(angle(exp)), 2)), deriv(angle(exp), variable)) :
    is_arcsine(exp) ? make_product(make_exponentiation(make_sum(1, -1), 0.5), deriv(angle(exp), variable)) :
    is_arccosine(exp) ? make_product(make_product(-1, make_exponentiation(make_sum(1, -1), 0.5)), deriv(angle(exp), variable)) :
    is_arctangent(exp) ? make_product(make_exponentiation(make_sum(1, -1), 2), deriv(angle(exp), variable)) :
    get("deriv", list(operator(exp)), list_of_values(operands(exp), variable));
}
const operator = (exp) => { return head(exp); }
const operands = (exp) => { return tail(exp); }

/*
Part (a): Since the predicates are not associated with any operator, they are not part of the data-directed dispatch system.
Part (d): Since the deriv function is not part of the data-directed dispatch system, there is no need to modify it.
*/
