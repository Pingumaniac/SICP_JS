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

const square = (x) => { return x * x; }

function square_list(items) {
    function iter(things, answer) {
        return things === null ? answer : iter(tail(things), Pair(square(head(things)), answer));
    }
    return iter(items, null);
}

function square_list2(items) {
   function iter(things, answer) {
       return things === null ? answer : iter(tail(things), answer, Pair(square(head(things))));
   }
   return iter(items, null);
}

/*
The above two functions do not work.
square_list does not work b/c it pairs the right item to the left item to the answer, but the answer is a list.
Hence the code ends up with (list (list  ;; ...) lastest-square) where latest-square is the squared value of
the last item in the list.

square_list2 does not work b/c it pairs the answer to the squared value, but the answer is a list.
Hence the code ends up with (list (list  ;; ...) lastest-square) where l
(list (list  ;; ...) lastest-square).
*/
