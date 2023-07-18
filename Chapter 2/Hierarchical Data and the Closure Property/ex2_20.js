function Pair(left, right) {
    this.left = left;
    this.right = right;
}

const head = (items) => { return items === null ? null : items.left; }
const tail = (items) => { return items === null ? null : items.right; }
const list = (...items) => { return items.length === 0 ? null : new Pair(items[0], list(...items.slice(1))); }
const append = (list1, list2) => { return list1 === null ? list2 : new Pair(head(list1), append(tail(list1), list2)); }
const reverse = (items) => { return items === null ? null : append(reverse(tail(items)), list(head(items))); }
const printList = (list) => { return list === null ? '' : head(list) + ' ' + printList(tail(list)); }

function plus_curried(x) { return y => x + y; }

const brooks = (curried_function, list_of_arguments) => {
    const brooks_iter = (a, b) => {
        return b === null ? a : brooks_iter(a(head(b)), tail(b));
    }
    return brooks_iter(curried_function, list_of_arguments);
}
console.log(brooks(plus_curried, list(3, 4)));

const brooks_curried = (curried_function, ...args) => {
    const brooks_iter = (a, b) => {
        return b === null ? a() : brooks_iter(() => curried_function(a())(head(b)), tail(b));
    }
    return brooks_iter(() => args[0], list(...args.slice(1)));
}
console.log(brooks_curried(plus_curried, 3, 4));
