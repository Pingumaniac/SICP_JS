const f = (n) => {
    return n < 3 ? n : f(n - 1) + 2 * f(n - 2) + 3 * f(n - 3);
}

const f_iterative = (n) => {
    const iter = (a, b, c, count) => {
        return n < 3 ? n : count <= 0 ? a : iter(a + 2 * b + 3 * c, a, b, count - 1);
    }
    return iter(2, 1, 0, n - 2);
}

console.log(f(0) === f_iterative(0));
console.log(f(1) === f_iterative(1));
console.log(f(2) === f_iterative(2));
console.log(f(3) === f_iterative(3));
console.log(f(4) === f_iterative(4));
