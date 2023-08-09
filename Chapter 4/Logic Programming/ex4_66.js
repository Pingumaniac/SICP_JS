/*
assert(rule(reverse([], [])));
assert(rule(reverse([$first, $rest], $x), and(reverse($rest, $y), append_to_form($first, $y) === $x)));
*/
const append_to_form = (element, list) => [...list, element];
const reverse = (x, y) => {
    if (x) {
        return x.reduce((acc, curr) => append_to_form(curr, acc), []);
    } else if (y) {
        return y.reduceRight((acc, curr) => append_to_form(curr, acc), []);
    } else {
        throw new Error('Invalid input');
    }
}
let $x = null;
let query1 = reverse([1, 2, 3], $x);
let query2 = reverse($x, [1, 2, 3]);
console.log(query1); // Output: [3, 2, 1]
console.log(query2); // Output: [3, 2, 1]
