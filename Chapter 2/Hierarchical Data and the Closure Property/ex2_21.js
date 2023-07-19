function Pair(left, right) {
    this.left = left;
    this.right = right;
}

const head = (items) => { return items === null ? null : items.left; }
const tail = (items) => { return items === null ? null : items.right; }
const list = (...items) => { return items.length === 0 ? null : new Pair(items[0], list(...items.slice(1))); }
const append = (list1, list2) => { return list1 === null ? list2 : new Pair(head(list1), append(tail(list1), list2)); }
const reverse = (items) => { return items === null ? null : append(reverse(tail(items)), list(head(items))); }
const print_list = (list) => { return list === null ? '' : head(list) + ' ' + print_list(tail(list)); }

/*
function scale_list(items, factor) {
    return items === null ? null : new Pair(head(items) * factor, scale_list(tail(items), factor));
}
*/
function map(fun, items) {
    return items === null ? null : new Pair(fun(head(items)), map(fun, tail(items)));
}
function scale_list(items, factor) {
    return map(x => x * factor, items);
}

function square_list(items) {
    return items === null ? null : new Pair(head(items) * head(items), square_list(tail(items)));
}

function square_list2(items) {
    return map(x => x * x, items);
}
