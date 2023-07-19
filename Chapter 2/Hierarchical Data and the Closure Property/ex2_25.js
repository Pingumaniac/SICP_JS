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
const for_each = (f, list) => { return list === null ? null : new Pair(f(head(list)), for_each(f, tail(list))); }
const count_leaves = (x) => { return x === null ? 0 : (x instanceof Pair ? count_leaves(head(x)) + count_leaves(tail(x)) : 1); }


// should pick 7
console.log(head(tail(head(tail(tail(list(1, 3, list(5, 7), 9)))))));
console.log(head(head(list(list(7)))));
let a = list(1, list(2, list(3, list(4, list(5, list(6, 7))))));
console.log(head(tail(head(tail(head(tail(head(tail(head(tail(head(tail(a)))))))))))));
