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
const count_leaves = (t) => { return accumulate((x, y) => x + y, 0, map(x => 1, fringe(t))); }
const plus = (x, y) => { return x + y; }
const minus = (x, y) => { return x - y; }
const times = (x, y) => { return x * y; }
const divide = (x, y) => { return y === 0 ? Infinity : x / y; };
const dot_product = (v, w) => { return accumulate(plus, 0, accumulate_n(times, 1, list(v, w))); }
const matrix_times_vector = (m , v) => { return map(row => dot_product(row, v), m); }
const transpose = (m) => { return accumulate_n(pair, null, m); }
const matrix_times_matrix = (m1, m2) => { return map(row => matrix_times_vector(transpose(m2), row), m1); }
const reverse = (sequence) => { return fold_left((x, y) => pair(y, x), null, sequence); }
const reverse_right = (sequence) => { return fold_right((x, y) => append(y, list(x)), null, sequence); }

const print_list = (list) => {
    if (list === null) {
        return '';
    } else if (head(list) instanceof Pair) {
        return '(' + print_list(head(list)) + ') ' + print_list(tail(list));
    } else {
        return head(list) + ' ' + print_list(tail(list));
    }
};
const deep_reverse = (items) => {
    if (items === null) {
        return null;
    } else {
        const headItems = (head(items) instanceof Pair) ? deep_reverse(head(items)) : head(items);
        return append(deep_reverse(tail(items)), list(headItems));
    }
};
const fringe = (items) => {
    if (items === null) {
        return null;
    } else if (head(items) instanceof Pair) {
        return append(fringe(head(items)), fringe(tail(items)));
    } else {
        return new Pair(head(items), fringe(tail(items)));
    }
};
const scale_tree = (tree, factor) => {
    return tree === null ? null : pair(scale_tree(head(tree), factor), scale_tree(tail(tree), factor));
}
const scale_tree_map = (tree, factor) => {
    return map(sub_tree => is_pair(sub_tree) ? scale_tree_map(sub_tree, factor) : sub_tree * factor, tree);
}
const square_tree = (tree) => {
    if (tree === null) {
        return null;
    } else if (head(tree) instanceof Pair) {
        return new Pair(square_tree(head(tree)), square_tree(tail(tree)));
    } else {
        return new Pair(head(tree) * head(tree), square_tree(tail(tree)));
    }
};
const square_tree_map = (tree) => {
    return map(sub_tree => sub_tree instanceof Pair ? square_tree_map(sub_tree) : sub_tree * sub_tree, tree);
}
const subset = (s) => {
    if (s === null) {
        return list(null);
    } else {
        const rest = subset(tail(s));
        return append(rest, map(x => pair(head(s), x), rest));
    }
}
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
const permutations = (s) => {
    return s === null ? list(null) : flat_map(x => map(p => pair(x, p), permutations(remove(x, s))), s);
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

function is_variable(x) { return is_string(x); }
function is_same_variable(v1, v2) { return is_variable(v1) && is_variable(v2) && v1 === v2; }
function make_product(m1, m2) { return list("*", m1, m2); }
function is_sum(x) { return is_pair(x) && head(x) === "+"; }
function addend(s) { return head(tail(s)); }
function augend(s) { return head(tail(tail(s))); }
function is_product(x) { return is_pair(x) && head(x) === "*"; }
function multiplier(p) { return head(tail(p)); }
function multiplicand(p) { return head(tail(tail(p))); }
function make_sum(a1, a2) {
    return number_equal (a1, 0) ? a2 : number_equal (a2, 0) ? a1 : is_number(a1) && is_number(a2) ? a1 + a2 : list("+", a1, a2);
}
function number_equal(a, b) { return is_number(a) && is_number(b) && a === b; }
function make_product(m1, m2) {
    return number_equal(m1, 0) || number_equal(m2, 0) ? 0 : number_equal(m1, 1) ? m2 : number_equal(m2, 1) ? m1 : is_number(m1) && is_number(m2) ? m1 * m2 : list("*", m1, m2);
}
function is_number(x) { return typeof x === "number"; }

const is_exp = (x) => { return is_pair(x) && head(x) === "**"; }
const base = (x) => { return head(tail(x)); }
const exponent = (x) => { return head(tail(tail(x))); }
const make_exp = (base, exponent) => { return exponent === 0 ? 1 : exponent === 1 ? base : list("**", base, exponent); }
const is_sine = (x) => { return is_pair(x) && head(x) === "sin"; }
const is_cosine = (x) => { return is_pair(x) && head(x) === "cos"; }
const is_quotient = (x) => { return is_pair(x) && head(x) === "/"; }
const make_sine = (x) => { return list("sin", x); }
const make_cosine = (x) => { return list("cos", x); }
const make_quotient = (n, d) => { return list("/", n, d); }
const is_parenthesis = (x) => { return is_pair(x) && head(x) === "parenthesis"; }
const make_parenthesis = (x) => { return list("parenthesis", x); }
const omit_parentheses = (x) => { return is_parenthesis(x) ? head(tail(x)) : x; }

function deriv(exp, variable) {
    return is_number(exp) ? 0 : is_variable(exp) ? is_same_variable(exp, variable) ? 1 : 0 :
    is_sum(exp) ? make_sum(deriv(addend(exp), variable), deriv(augend(exp), variable)) :
    is_product(exp) ? make_sum(make_product(multiplier(exp), deriv(multiplicand(exp), variable)),
    make_product(deriv(multiplier(exp), variable), multiplicand(exp))) :
    is_exp(exp) ? make_product(make_product(exponent(exp), make_exp(base(exp),
    make_sum(exponent(exp), -1))), deriv(base(exp), variable)) :
    is_sine(exp) ? make_product(make_cosine(argument(exp)), deriv(argument(exp), variable)) :
    is_cosine(exp) ? make_product(make_product(-1, make_sine(argument(exp))), deriv(argument(exp), variable)) :
    is_quotient(exp) ? make_quotient(make_sum(make_product(deriv(numerator(exp), variable), denominator(exp)),
    make_product(-1, make_product(numerator(exp), deriv(denominator(exp), variable)))),
    make_exp(denominator(exp), 2)) :
    is_pair(exp) ? make_sum(deriv(head(exp), variable), deriv(tail(exp), variable)) :
    is_parenthesis(exp)? deriv(content(exp), variable) :
    omit_parentheses(exp) ? deriv(make_parenthesis(exp), variable) :
    error(exp, "Unknown expression type in deriv");
}

function entry(tree) { return head(tree); }
function left_branch(tree) { return head(tail(tree)); }
function right_branch(tree) { return head(tail(tail(tree))); }
function make_tree(entry, left_branch, right_branch) { return list(entry, left_branch, right_branch); }

function is_element_of_set(x, set) {
    return is_null(set) ? false :
           x === entry(set) ? true :
           x < entry(set) ? is_element_of_set(x, left_branch(set)) :
           // x > entry(set)
           is_element_of_set(x, right_branch(set));
}
function adjoin_set(x, set) {
    return is_null(set) ? make_tree(x, null, null) :
           x === entry(set) ? set :
           x < entry(set) ? make_tree(entry(set), adjoin_set(x, left_branch(set)), right_branch(set)) :
           // x > entry(set)
           make_tree(entry(set), left_branch(set), adjoin_set(x, right_branch(set)));
}

function tree_to_list_1(tree) {
    return is_null(tree)
           ? null
           : append(tree_to_list_1(left_branch(tree)),
                    pair(entry(tree),
                         tree_to_list_1(right_branch(tree))));
}
function tree_to_list_2(tree) {
    function copy_to_list(tree, result_list) {
        return is_null(tree)
               ? result_list
               : copy_to_list(left_branch(tree),
                              pair(entry(tree),
                                   copy_to_list(right_branch(tree),
                                                result_list)));
    }
    return copy_to_list(tree, null);
}

/*
(a) Both output same result for every tree as they are both traversing the tree in the same order (inorder traversal).
(b) Order of growth: tree_to_list_1 is O(n^2) and tree_to_list_2 is O(n).
Reasons:
1. tree_to_list_1 is appending the result of left branch to the result of right branch which is O(n^2).
2. tree_to_list_2 is using tail recursion which is O(n).


*/
