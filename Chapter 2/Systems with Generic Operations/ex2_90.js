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
const first_term = L => head(L);
const rest_terms = L => tail(L);
const is_empty_termlist = L => L === null;
const is_equal_to_zero = x => x === 0;
const make_term = (order, coeff) => list(order, coeff);
const order = term => head(term);
const coeff = term => tail(term);
const make_polynomial = (variable, term) => attach_tag("polynomial", pair(variable, term));
const first_term_dense_poly = L => make_term(length(L) - 1, head(L));

// ex 2.90
const apply_generic = (op, args) => {
    const type_tags = map(type_tag, args);
    const fun = get(op, type_tags);
    return fun === undefined ? error(list(op, type_tags), "No method for these types in apply_generic") : fun(head(args), tail(args));
}
const get = (op, type_tags) => {
    if (head(type_tags) === null) {
        return undefined;
    } else {
        const type_tag = head(type_tags);
        const fun = get(op, tail(type_tags));
        return fun === undefined ? get(op, tail(type_tags)) : fun;
    }
}
const add_poly = (p1, p2) => apply_generic("add", list(p1, p2));
const sub_poly = (p1, p2) => apply_generic("sub", list(p1, p2));
const mul_poly = (p1, p2) => apply_generic("mul", list(p1, p2));
const make_poly = (variable, term) => apply_generic("make", list(variable, term));
const coefficients = p => apply_generic("coefficients", list(p));
const variable = p => apply_generic("variable", list(p));

const add_terms = (L1, L2) => {
    const type_tag = head(L1);
    return type_tag === "sparse_poly" ? add_sparse_poly(L1, L2) : add_dense_poly(L1, L2);
}
const mul_terms = (L1, L2) => {
    const type_tag = head(L1);
    return type_tag === "sparse_poly" ? mul_sparse_poly(L1, L2) : mul_dense_poly(L1, L2);
}
const sub_terms = (L1, L2) => {
    const type_tag = head(L1);
    return type_tag === "sparse_poly" ? sub_sparse_poly(L1, L2) : sub_dense_poly(L1, L2);
}
const adjoin_term = (term, L) => {
    const type_tag = head(L);
    return type_tag === "sparse_poly" ? adjoin_term_sparse_poly(term, L) : adjoin_term_dense_poly(term, L);
}
const add_dense_poly = (L1, L2) => {
    return is_empty_termlist(L1) ? L2 : is_empty_termlist(L2) ? L1 :
    adjoin_term_dense_poly(make_term(order(first_term_dense_poly(L1)),
    coeff(first_term_dense_poly(L1)) + coeff(first_term_dense_poly(L2))),
    add_dense_poly(rest_terms(L1), rest_terms(L2)));
}
const add_sparse_poly = (L1, L2) => {
    return is_empty_termlist(L1) ? L2 : is_empty_termlist(L2) ? L1 :
    order(first_term(L1)) > order(first_term(L2)) ?
    adjoin_term_sparse_poly(first_term(L1), add_sparse_poly(rest_terms(L1), L2)) :
    order(first_term(L1)) < order(first_term(L2)) ?
    adjoin_term_sparse_poly(first_term(L2), add_sparse_poly(L1, rest_terms(L2))) :
    adjoin_term_sparse_poly(make_term(order(first_term(L1)), coeff(first_term(L1)) + coeff(first_term(L2))),
    add_sparse_poly(rest_terms(L1), rest_terms(L2)));
}
const mul_dense_poly = (L1, L2) => {
    return is_empty_termlist(L1) ? null :
    add_terms(mul_term_by_all_terms(first_term_dense_poly(L1), L2), mul_dense_poly(rest_terms(L1), L2));
}
const mul_sparse_poly = (L1, L2) => {
    return is_empty_termlist(L1) ? null : add_terms(mul_term_by_all_terms(first_term(L1), L2),
    mul_sparse_poly(rest_terms(L1), L2));
}
const mul_term_by_all_terms = (t1, L) => {
    if (L === null) {
        return null;
    } else {
        const t2 = first_term(L);
        return adjoin_term(make_term(order(t1) + order(t2), coeff(t1) * coeff(t2)), mul_term_by_all_terms(t1, rest_terms(L)));
    }
}
const sub_dense_poly = (L1, L2) => {
    return is_empty_termlist(L1) ? scale_poly(-1, L2) : is_empty_termlist(L2) ? L1 :
    adjoin_term_dense_poly(make_term(order(first_term_dense_poly(L1)), coeff(first_term_dense_poly(L1))
    - coeff(first_term_dense_poly(L2))), sub_dense_poly(rest_terms(L1), rest_terms(L2)));
}
const sub_sparse_poly = (L1, L2) => {
    return is_empty_termlist(L1) ? scale_poly(-1, L2) : is_empty_termlist(L2) ? L1 :
    order(first_term(L1)) > order(first_term(L2)) ?
    adjoin_term_sparse_poly(first_term(L1), sub_sparse_poly(rest_terms(L1), L2)) :
    order(first_term(L1)) < order(first_term(L2)) ?
    adjoin_term_sparse_poly(make_term(order(first_term(L2)), -coeff(first_term(L2))), sub_sparse_poly(L1, rest_terms(L2))) :
    adjoin_term_sparse_poly(make_term(order(first_term(L1)), coeff(first_term(L1)) - coeff(first_term(L2))),
    sub_sparse_poly(rest_terms(L1), rest_terms(L2)));
}
const adjoin_term_dense_poly = (term, L) => {
    coeff(term) === 0 ? L : order(term) === length(L) ? pair(coeff(term), L) : adjoin_term(term, pair(0, L))
};
const adjoin_term_sparse_poly = (term, L) => {
    coeff(term) === 0 ? L : order(term) === order(first_term(L)) ?
    pair(make_term(order(term), coeff(term) + coeff(first_term(L))), rest_terms(L)) :
    order(term) > order(first_term(L)) ?
    pair(first_term(L), adjoin_term_sparse_poly(term, rest_terms(L))) : pair(term, L)
};

const install_dense_poly_package = () => {
    const make_dense_poly = (variable, term) => attach_tag("dense_poly", pair(variable, term));
    const variable = p => head(p);
    const term = p => tail(p);
    const is_equal_to_zero = x => x === 0;
    const tag = x => attach_tag("dense_poly", x);
    put("add", "dense_poly", add_dense_poly);
    put("sub", "dense_poly", sub_dense_poly);
    put("mul", "dense_poly", mul_dense_poly);
    put("make", "dense_poly", (variable, terms) => tag(make_dense_poly(variable, terms)));
    put("is_equal_to_zero", "dense_poly", is_equal_to_zero);
}

const install_sparse_poly_package = () => {
    const make_spare_poly = (variable, term) => attach_tag("sparse_poly", pair(variable, term));
    const variable = p => head(p);
    const term = p => tail(p);
    const is_equal_to_zero = x => x === 0;
    const tag = x => attach_tag("sparse_poly", x);
    put("add", "sparse_poly", add_sparse_poly);
    put("sub", "sparse_poly", sub_sparse_poly);
    put("mul", "sparse_poly", mul_sparse_poly);
    put("make", "sparse_poly", (variable, terms) => tag(make_spare_poly(variable, terms)));
    put("is_equal_to_zero", "sparse_poly", is_equal_to_zero);
}
