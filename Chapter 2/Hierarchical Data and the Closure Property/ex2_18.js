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

let testList = list(23, 72, 149, 34);
console.log(print_list(reverse(testList)));
