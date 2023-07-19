function Pair(left, right) {
    this.left = left;
    this.right = right;
}

const head = (items) => { return items === null ? null : items.left; }
const tail = (items) => { return items === null ? null : items.right; }
const list = (...items) => { return items.length === 0 ? null : new Pair(items[0], list(...items.slice(1))); }
const append = (list1, list2) => { return list1 === null ? list2 : new Pair(head(list1), append(tail(list1), list2)); }
const reverse = (items) => { return items === null ? null : append(reverse(tail(items)), list(head(items))); }
const for_each = (f, list) => { return list === null ? null : new Pair(f(head(list)), for_each(f, tail(list))); }
const count_leaves = (x) => { return x === null ? 0 : (x instanceof Pair ? count_leaves(head(x)) + count_leaves(tail(x)) : 1); }
const pair = (x, y) => { return new Pair(x, y); }

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

/*
for make_mbobile and make_branch

using pair instead of list because of the following:
    const make_mobile = (left, right) => { return list(left, right); }
    const make_branch = (length, structure) => { return list(length, structure); }
    const left_branch = (mobile) => { return head(mobile); }
    const right_branch = (mobile) => { return tail(mobile); }
    const branch_length = (branch) => { return head(branch); }
    const branch_structure =(branch) => { return tail(branch); }
    const total_weight = (mobile) => { return branch_weight(left_branch(mobile)) + branch_weight(right_branch(mobile));}
    const branch_weight = (branch) => { return is_mobile(branch) ? total_weight(branch) : branch_length(branch); }
    const is_mobile = (structure) => { return !(head(structure) instanceof Pair) && !(tail(structure) instanceof Pair); }
    const is_balanced = (mobile) => { return branch_torque(left_branch(mobile)) === branch_torque(right_branch(mobile)); }
    const branch_torque = (branch) => { return branch_length(branch) * branch_weight(branch); }

pair vs list in this case:
    pair: make_mobile(1, 2) -> (1, 2)
    list: make_mobile(1, 2) -> (1 2)
    pair: make_branch(1, 2) -> (1, 2)
    list: make_branch(1, 2) -> (1 2)

pair is better because it is easier to read and understand
list is better because it is easier to implement
*/
