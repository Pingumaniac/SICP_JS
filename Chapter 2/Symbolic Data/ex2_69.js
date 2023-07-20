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
const is_cosine = (x) => { return is_pair(x) && head(x) === "cos"; }
const is_quotient = (x) => { return is_pair(x) && head(x) === "/"; }
const make_sine = (x) => { return list("sin", x); }
const make_cosine = (x) => { return list("cos", x); }
const make_quotient = (n, d) => { return list("/", n, d); }
const is_parenthesis = (x) => { return is_pair(x) && head(x) === "parenthesis"; }
const make_parenthesis = (x) => { return list("parenthesis", x); }
const omit_parentheses = (x) => { return is_parenthesis(x) ? head(tail(x)) : x; }

const deriv = (exp, variable) => {
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

const entry = (tree) => { return head(tree); }
const make_tree = (entry, left_branch, right_branch) => { return list(entry, left_branch, right_branch); }
const make_leaf = (symbol, weight) => { return list("leaf", symbol, weight); }
const is_leaf = (object) => { return head(object) === "leaf"; }
const symbol_leaf = (x) => { return head(tail(x)); }
const weight_leaf = (x) => { return head(tail(tail(x))); }
const make_code_tree = (left, right) => {
    return list("code_tree", left, right, append(symbols(left), symbols(right)), weight(left) + weight(right));
}
const left_branch = (tree) => { return head(tail(tree)); }
const right_branch = (tree) => { return head(tail(tail(tree))); }
const weight = (tree) => { return is_leaf(tree) ? weight_leaf(tree) : head(tail(tail(tail(tail(tree))))); }
function decode(bits, tree) {
    function decode_1(bits, current_branch) {
        if (bits === null) {
            return null;
        } else {
            const next_branch = choose_branch(head(bits), current_branch);
            return is_leaf(next_branch) ? pair(symbol_leaf(next_branch), decode_1(tail(bits), tree)) : decode_1(tail(bits), next_branch);
        }
    }
    return decode_1(bits, tree);
}
function choose_branch(bit, branch) {
    return bit === 0 ? left_branch(branch) : bit === 1 ? right_branch(branch) : error(bit, "bad bit -- choose_branch");
}
function adjoin_set(x, set) {
    return set ===  null ? list(x) : weight(x) < weight(head(set)) ? pair(x, set) : pair(head(set), adjoin_set(x, tail(set)));
}
function make_leaf_set(pairs) {
    if (pairs === null) {
        return null;
    } else {
        const first_pair = head(pairs);
        return adjoin_set(make_leaf(head(first_pair), head(tail(first_pair))), make_leaf_set(tail(pairs)));
    }
}

const encode = (message, tree) => {
    return message === null ? null : append(encode_symbol(head(message), tree), encode(tail(message), tree));
}
const symbols = (tree) => { return is_leaf(tree) ? list(symbol_leaf(tree)) : head(tail(tail(tail(tree)))); }
const contains = (element, list) => { return list === null ? false : head(list) === element ? true : contains(element, tail(list)) };
const encode_symbol = (char, tree) => {
    if (is_leaf(tree)) {
        return null;
    } else if (contains(char, symbols(left_branch(tree)))) {
        return pair(0, encode_symbol(char, left_branch(tree)));
    } else if (contains(char, symbols(right_branch(tree)))) {
        return pair(1, encode_symbol(char, right_branch(tree)));
    } else {
        throw new Error(`Symbol not in the Huffman Encoding Tree: ${char}`);
    }
}

const generate_huffman_tree = (pairs) => { return successive_merge(make_leaf_set(pairs)); }
// exercise 2.69
const successive_merge = (pairs) => {
    if (length(pairs) === 1) {
        return head(pairs);
    } else {
        const first_pair = head(pairs);
        const second_pair = head(tail(pairs));
        const rest_pairs = tail(tail(pairs));
        const new_pair = make_code_tree(first_pair, second_pair);
        return successive_merge(adjoin_set(new_pair, rest_pairs));
    }
}

// const sample_tree = make_code_tree(make_leaf("A", 4), make_code_tree(make_leaf("B", 2), make_code_tree(make_leaf("D", 1), make_leaf("C", 1))));
// const sample_message = list(0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0);
// const sample_message = list("A", "D", "A", "B", "B", "C", "A")
// console.log(print_list(encode(sample_message, sample_tree)));
