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

const x = list(list(1, 2), list(3, 4));
console.log(print_list(fringe(x)));
console.log(print_list(fringe(list(x, x))));
