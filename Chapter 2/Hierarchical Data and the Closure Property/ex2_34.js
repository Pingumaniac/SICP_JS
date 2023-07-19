function Pair(left, right) { this.left = left; this.right = right; }
const head = (items) => { return items === null ? null : items.left; }
const tail = (items) => { return items === null ? null : items.right; }
const list = (...items) => { return items.length === 0 ? null : new Pair(items[0], list(...items.slice(1))); }
const reverse = (items) => { return items === null ? null : append(reverse(tail(items)), list(head(items))); }
const for_each = (f, list) => { return list === null ? null : new Pair(f(head(list)), for_each(f, tail(list))); }
const count_leaves = (x) => { return x === null ? 0 : (x instanceof Pair ? count_leaves(head(x)) + count_leaves(tail(x)) : 1); }
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
// const map = (f, items) => { return items === null ? null : new Pair(f(head(items)), map(f, tail(items))); }
// const append = (list1, list2) => { return list1 === null ? list2 : new Pair(head(list1), append(tail(list1), list2)); }
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

function horder_eval(x, coefficient_sequence) {
    return accumulate((this_coeff, higher_terms) => x * higher_terms + this_coeff, 0, coefficient_sequence);
}
