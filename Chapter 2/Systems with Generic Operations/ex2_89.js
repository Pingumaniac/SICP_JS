function Pair(left, right) { this.left = left; this.right = right; }
const head = items => items === null || items === undefined ? null : items.left;
const tail = items => items === null || items === undefined ? null : items.right;
const list = (...items) => items.length === 0 ? null : new Pair(items[0], list(...items.slice(1)));
const for_each = (f, list) => list === null ? null : new Pair(f(head(list)), for_each(f, tail(list)));
const pair = (x, y) => new Pair(x, y);
const is_pair = x => x instanceof Pair;
const map = (f, sequence) => accumulate((x, y) => pair(f(x), y), null, sequence);
const append = (seq1, seq2) => accumulate(pair, seq2, seq1);
const length = (sequence) => { return accumulate((x, y) => y + 1, 0, sequence); }
const enumerate_interval = (low, high) => low > high ? null : pair(low, enumerate_interval(low + 1, high))

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
    return is_same_variable(term(p1), term(p2)) ? make_poly(term(p1), add_terms(coefficients(p1), coefficients(p2))) : error(list(p1, p2), "Polys not in same var -- add_poly");
}
const mul_poly = (p1, p2) => {
    return is_same_variable(term(p1), term(p2)) ? make_poly(term(p1), mul_terms(coefficients(p1), coefficients(p2))) : error(list(p1, p2), "Polys not in same var -- mul_poly");
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

const install_polynomial_package = () => {
    const make_poly = (variable, term) => attach_tag("polynomial", pair(variable, term));
    const variable = p => head(p);
    const term = p => tail(p);
    const add_poly = (p1, p2) => {
        return is_same_variable(term(p1), term(p2)) ? make_poly(term(p1), add_terms(coefficients(p1), coefficients(p2))) : error(list(p1, p2), "Polys not in same var -- add_poly");
    }
    const sub_poly = (p1, p2) => {
        return is_same_variable(term(p1), term(p2)) ? make_poly(term(p1), sub_terms(coefficients(p1), coefficients(p2))) : error(list(p1, p2), "Polys not in same var -- sub_poly");
    }
    const mul_poly = (p1, p2) => {
        return is_same_variable(term(p1), term(p2)) ? make_poly(term(p1), mul_terms(coefficients(p1), coefficients(p2))) : error(list(p1, p2), "Polys not in same var -- mul_poly");
    }
    const is_equal_to_zero = x => x === 0;
    const tag = x => attach_tag("polynomial", x);
    put("add", "polynomial", add_poly);
    put("sub", "polynomial", sub_poly);
    put("mul", "polynomial", mul_poly);
    put("make", "polynomial", (variable, terms) => tag(make_poly(variable, terms)));
    put("is_equal_to_zero", "polynomial", is_equal_to_zero);
}

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

// ex 2.89 functions for term-list representation for dense polynomials
const first_term_dense_polynomial = L => make_term(length(L) - 1, head(L));
const adjoin_term_dense_polynomial = (term, L) => coeff(term) === 0 ? L : order(term) === length(L) ? pair(coeff(term), L) : adjoin_term(term, pair(0, L));
