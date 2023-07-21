function Pair(left, right) { this.left = left; this.right = right; }
const head = (items) => {
    if (items === null || items === undefined) {
        return null;
    } else if (typeof items === "object" && items.hasOwnProperty('left')) {
        return items.left;
    } else if (Array.isArray(items)) {
        return items.length > 0 ? items[0] : null;
    } else {
        throw new Error(`Cannot call 'head' on non-pair: ${items}`);
    }
}
const tail = items => items === null || items === undefined ? null : items.right;
const list = (...items) => items.length === 0 ? null : new Pair(items[0], list(...items.slice(1)));
const for_each = (f, list) => list === null ? null : new Pair(f(head(list)), for_each(f, tail(list)));
const pair = (x, y) => new Pair(x, y);
const is_pair = x => x instanceof Pair;
const map = (f, sequence) => accumulate((x, y) => pair(f(x), y), null, sequence);
const append = (seq1, seq2) => accumulate(pair, seq2, seq1);
const length = (sequence) => { return accumulate((x, y) => y + 1, 0, sequence); }
const enumerate_interval = (low, high) => low > high ? null : pair(low, enumerate_interval(low + 1, high))
const error = (obj, message) => { throw new Error(message + ': ' + obj); }

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
const member = (item, x) => x === null ? false : item === head(x) ? true : member(item, tail(x));
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

const attach_tag = (tag, contents) => pair(tag, contents);
const add = (x, y) => apply_generic("add", list(x, y));
const sub = (x, y) => apply_generic("sub", list(x, y));
const mul = (x, y) => apply_generic("mul", list(x, y));
const div = (x, y) => apply_generic("div", list(x, y));

let operations = {};
const put = (op, type, item) => {
    if (operations[op] === undefined) {
        operations[op] = {};
    }
    operations[op][type] = item;
};

const is_same_variable = (v1, v2) => is_variable(v1) && is_variable(v2) && v1 === v2;
const is_variable = x => is_string(x);
const is_string = x => typeof x === 'string';

const add_poly = (p1, p2) => {
    return is_same_variable(term(p1), term(p2)) ? make_polynomial(term(p1), add_terms(coeff(p1), coeff(p2))) : error(list(p1, p2), "Polys not in same var -- add_poly");
}
const mul_poly = (p1, p2) => {
    return is_same_variable(term(p1), term(p2)) ? make_polynomial(term(p1), mul_terms(coeff(p1), coeff(p2))) : error(list(p1, p2), "Polys not in same var -- mul_poly");
}
const add_terms = (L1, L2) => {
    if (L1 === null) {
        return L2;
    } else if (L2 === null) {
        return L1;
    } else {
        const t1 = first_term(L1);
        const t2 = first_term(L2);
        return order(t1) > order(t2) ? adjoin_term(t1, add_terms(rest_terms(L1), L2)) :
            order(t1) < order(t2) ? adjoin_term(t2, add_terms(L1, rest_terms(L2))) :
            add_terms(make_term(order(t1), coeff(t1) + coeff(t2)), add_terms(rest_terms(L1), rest_terms(L2)));
    }
}
const mul_terms = (L1, L2) => {
    return L1 === null || L2 === null ? null : adjoin_term(mul_term_by_all_terms(first_term(L1), L2), mul_terms(rest_terms(L1), L2));
}
const mul_term_by_all_terms = (t1, L) => {
    if (L === null) {
        return null;
    } else {
        const t2 = first_term(L);
        return adjoin_term(make_term(order(t1) + order(t2), coeff(t1) * coeff(t2)), mul_term_by_all_terms(t1, rest_terms(L)));
    }
}
const adjoin_term = (term, L) => coeff(term) === 0 ? L : pair(term, L);
const first_term = L => head(L);
const rest_terms = L => tail(L);
const is_empty_termlist = L => L === null;
const make_term = (order, coeff) => list(order, coeff);
const order = term => head(term);
const coeff = term => tail(term);
const make_polynomial = (variable, term) => attach_tag("polynomial", pair(variable, term));

const sub_terms = (L1, L2) => {
    if (L1 === null) {
        return L2;
    } else if (L2 === null) {
        return L1;
    } else {
        const t1 = first_term(L1);
        const t2 = first_term(L2);
        return order(t1) > order(t2) ? adjoin_term(t1, sub_terms(rest_terms(L1), L2)) :
            order(t1) < order(t2) ? adjoin_term(make_term(order(t2), -1 * coeff(t2)), sub_terms(L1, rest_terms(L2))) :
            sub_terms(make_term(order(t1), coeff(t1) - coeff(t2)), sub_terms(rest_terms(L1), rest_terms(L2)));
    }
}

const first_term_dense_polynomial = L => make_term(length(L) - 1, head(L));
const adjoin_term_dense_polynomial = (term, L) => coeff(term) === 0 ? L : order(term) === length(L) ? pair(coeff(term), L) : adjoin_term(term, pair(0, L));

const div_terms = (L1, L2) => {
    if (L1 === null) {
        return list(null, null);
    } else {
        const t1 = first_term(L1);
        const t2 = first_term(L2);
        if (order(t2) > order(t1)) {
            return list(null, L1);
        } else {
            const new_c = div(coeff(t1), coeff(t2));
            const new_o = sub(order(t1), order(t2));
            const rest_of_result = div_terms(rest_terms(L1), L2);
            return list(adjoin_term(make_term(new_o, new_c), first_term(rest_of_result)), second_term(rest_of_result));
        }
    }
}

const div_poly = (p1, p2) => {
    if (is_empty_termlist(coeff(p2))) {
        return error(list(p1, p2), "Divide by zero polynomial -- div_poly");
    } else if (is_empty_termlist(coeff(p1))) {
        return list(make_zero_poly(variable(p1)), make_zero_poly(variable(p1)));
    } else {
        return div_terms(coeff(p1), coeff(p2));
    }
}

const install_polynomial_package = () => {
    const make_polynomial = (variable, term) => attach_tag("polynomial", pair(variable, term));
    const variable = p => head(p);
    const term = p => tail(p);
    const add_poly = (p1, p2) => {
        const ordered_variable = term(p1) < term(p2) ? term(p1) : term(p2);
        return is_same_variable(term(p1), term(p2)) ? make_polynomial(ordered_variable, add_terms(coeff(p1), coeff(p2))) : error(list(p1, p2), "Polys not in same var -- add_poly");
    }
    const sub_poly = (p1, p2) => {
        const ordered_variable = term(p1) < term(p2) ? term(p1) : term(p2);
        return is_same_variable(term(p1), term(p2)) ? make_polynomial(ordered_variable, sub_terms(coeff(p1), coeff(p2))) : error(list(p1, p2), "Polys not in same var -- sub_poly");
    }
    const mul_poly = (p1, p2) => {
        if (is_same_variable(term(p1), term(p2))) {
            return make_polynomial(term(p1), mul_terms(coeff(p1), coeff(p2)));
        } else {
            const ordered_variable = term(p1) < term(p2) ? term(p1) : term(p2);
            return make_polynomial(ordered_variable, mul_terms(coeff(p1), coeff(p2)));
        }
    }
    const div_poly = (p1, p2) => {
        if (is_empty_termlist(coeff(p2))) {
            return error(list(p1, p2), "Divide by zero polynomial -- div_poly");
        } else if (is_empty_termlist(coeff(p1))) {
            return list(make_zero_poly(variable(p1)), make_zero_poly(variable(p1)));
        } else {
            const ordered_variable = term(p1) < term(p2) ? term(p1) : term(p2);
            return make_polynomial(ordered_variable, div_terms(coeff(p1), coeff(p2)));
        }
    }
    const is_equal_to_zero = x => x === 0;
    const tag = x => attach_tag("polynomial", x);
    put("add", "polynomial", add_poly);
    put("sub", "polynomial", sub_poly);
    put("mul", "polynomial", mul_poly);
    put("div", "polynomial", div_poly);
    put("make", "polynomial", (variable, terms) => tag(make_polynomial(variable, terms)));
    put("is_equal_to_zero", "polynomial", is_equal_to_zero);
}

// ex 2.93
const apply_generic = (op, args) => {
    const type_tags = map(type_tag, args);
    const proc = get(op, type_tags);
    return proc !== undefined ? proc(map(contents, args)) : error(list(op, type_tags), "No method for these types -- apply_generic");
}
const contents = x => x;

const get = (op, type_tags) => {
    if (type_tags === null) {
        return undefined;
    } else {
        const type = head(type_tags);
        const proc = (operations[op] !== undefined) ? operations[op][type] : undefined;
        return proc !== undefined ? proc : get(op, tail(type_tags));
    }
}

const type_tag = item => is_pair(item) ? head(item) : item;

const install_rational_package = () => {
    const numer = x => head(x);
    const denom = x => tail(x);
    const make_rational = (n, d) => attach_tag("rational", pair(n, d));
    const add_rat = (x, y) => {
        const new_numer = apply_generic("add", apply_generic("mul", numer(x), denom(y)), apply_generic("mul", numer(y), denom(x)));
        const new_denom = apply_generic("mul", denom(x), denom(y));
        return make_rational(new_numer, new_denom);
    }
    const sub_rat = (x, y) => {
        const new_numer = apply_generic("sub", apply_generic("mul", numer(x), denom(y)), apply_generic("mul", numer(y), denom(x)));
        const new_denom = apply_generic("mul", denom(x), denom(y));
        return make_rational(new_numer, new_denom);
    }
    const mul_rat = (x, y) => {
        const new_numer = apply_generic("mul", numer(x), numer(y));
        const new_denom = apply_generic("mul", denom(x), denom(y));
        return make_rational(new_numer, new_denom);
    }
    const div_rat = (x, y) => {
        const new_numer = apply_generic("mul", numer(x), denom(y));
        const new_denom = apply_generic("mul", denom(x), numer(y));
        return make_rational(new_numer, new_denom);
    }
    const equal_rat = (x, y) => is_equal_to_zero(sub_rat(mul_rat(numer(x), denom(y)), mul_rat(numer(y), denom(x))));
    put("add", "rational", add_rat);
    put("sub", "rational", sub_rat);
    put("mul", "rational", mul_rat);
    put("div", "rational", div_rat);
    put("equal", "rational", equal_rat);
    put("make", "rational", make_rational);
}

// Install packages
install_polynomial_package();
install_rational_package();

// Create polynomials
const p1 = make_polynomial("x", list(make_term(2, 1), make_term(0, 1)));
console.log(print_list(p1));
const p2 = make_polynomial("x", list(make_term(3, 1), make_term(0, 1)));
console.log(print_list(p2));

// Create rational with polynomials
const make_rational = (n, d) => attach_tag("rational", pair(n, d));
const rf = make_rational(p2, p1);

// Perform operations and print results
console.log("Rational: ", print_list(rf));

