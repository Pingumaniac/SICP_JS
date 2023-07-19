function Pair(left, right) { this.left = left; this.right = right; }
const head = (items) => { return items === null || items === undefined ? null : items.left; }
const tail = (items) => { return items === null || items === undefined ? null : items.right; }
const list = (...items) => { return items.length === 0 ? null : new Pair(items[0], list(...items.slice(1))); }
const for_each = (f, list) => { return list === null ? null : new Pair(f(head(list)), for_each(f, tail(list))); }
const pair = (x, y) => { return new Pair(x, y); }
const is_pair = (x) => { return x instanceof Pair; }
const make_mobile = (left, right) => { return pair(left, right); }
const make_branch = (length, structure) => { return pair(length, structure); }
const left_branch = (mobile) => { return head(mobile); }
const right_branch = (mobile) => { return tail(mobile); }
const branch_length = (branch) => { return head(branch); }
const branch_structure =(branch) => { return tail(branch); }
const total_weight = (mobile) => { return branch_weight(left_branch(mobile)) + branch_weight(right_branch(mobile));}
const branch_weight = (branch) => { return is_mobile(branch) ? total_weight(branch) : branch_length(branch); }
const is_mobile = (structure) => { return !(head(structure) instanceof Pair) && !(tail(structure) instanceof Pair); }
const is_balanced = (mobile) => { return branch_torque(left_branch(mobile)) === branch_torque(right_branch(mobile)); }
const branch_torque = (branch) => { return branch_length(branch) * branch_weight(branch); }
// const reverse = (items) => { return items === null ? null : append(reverse(tail(items)), list(head(items))); }
// const count_leaves = (x) => { return x === null ? 0 : (x instanceof Pair ? count_leaves(head(x)) + count_leaves(tail(x)) : 1); }
// const map = (f, items) => { return items === null ? null : new Pair(f(head(items)), map(f, tail(items))); }
// const append = (list1, list2) => { return list1 === null ? list2 : new Pair(head(list1), append(tail(list1), list2)); }
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
const is_prime_sum = (pair) => { return is_prime(head(pair) + head(tail(pair))); }
const is_prime = (n) => {
    const iter = (test_divisor) => {
        return square(test_divisor) > n ? true : divides(test_divisor, n) ? false : iter(test_divisor + 1);
    }
    return iter(2);
}
const make_pair_sum = (pair) => { return list(head(pair), head(tail(pair)), head(pair) + head(tail(pair))); }
const prime_sum_pairs = (n) => {
    return map(make_pair_sum, filter(is_prime_sum, flat_map(i => map(j => pair(i, j), enumerate_interval(1, i - 1)), enumerate_interval(1, n))));
}
const permutations = (s) => {
    return s === null ? list(null) : flat_map(x => map(p => pair(x, p), permutations(remove(x, s))), s);
}
const remove = (item, sequence) => {
    return sequence === null ? null : item === head(sequence) ? tail(sequence) : pair(head(sequence), remove(item, tail(sequence)));
}
const unique_pairs = (n) => {
    return flat_map(i => map(j => pair(i, j), enumerate_interval(1, i - 1)), enumerate_interval(1, n));
}
const unique_triples = (n) => {
    return flat_map(i => flat_map(j => map(k => list(i, j, k), enumerate_interval(1, j - 1)), enumerate_interval(1, i - 1)), enumerate_interval(1, n));
}

const queens = (board_size) => {
    const queens_cols = (k) => {
        return k === 0 ? list(empty_board) :
        filter(position => is_safe(k, position),
        flat_map(new_row => map(rest_of_queens => adjoin_position(new_row, k, rest_of_queens),
        enumerate_interval(1, board_size), queens_cols(k - 1))));
    }
    return queens_cols(board_size);
}
const queens2 = (board_size) => {
    const queens_cols = (k) => {
        return k === 0 ? list(empty_board) :
        filter(position => is_safe(k, position),
        flat_map(new_row => map(rest_of_queens => adjoin_position(new_row, k, rest_of_queens), queens_cols(k - 1)),
        enumerate_interval(1, board_size)));
    }
    return queens_cols(board_size);
}
const is_safe = (k, positions) => {
    const position = head(positions);
    return accumulate((pos, rest) => is_safe_pair(position, pos) && rest, true, tail(positions));
}
const empty_board = null;
const rest_of_queens = (positions) => { return tail(positions); }
const adjoin_position = (new_row, k, rest_of_queens) => { return pair(new_row, pair(k, rest_of_queens)); }

/*
queens vs queens2

when queens take T times,
queens2 take T + T + T + ... + T = T * n times

This is because queens2 generates all possible positions for the first k - 1 queens, and then filters out the positions
that are not safe for the kth queen.

This is slower than queens1 because queens1 generates all possible
positions for the kth queen, and then filters out the positions that are not safe for the kth queen.
*/
