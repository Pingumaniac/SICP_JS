function A(x, y) {
    return y === 0 ? 0 : x == 0 ? 2 * y : y == 1 ? 2 : A(x - 1, A(x, y - 1));
}

console.log(A(1, 10)); // 1024
console.log(A(2, 4)); // 65536
console.log(A(3, 3)); // 65536

function f(n) {
    return A(0, n); //  returns 2 * n
}

function g(n) {
    return A(1, n); // returns 0 for  n = 0, returns 2^n for n > 0
}

function h(n) {
    return A(2, n); // returns 0 for n = 0,  returns 2 for n = 1, returns 2^(2^(...(n times))) for n > 1
}

function k(n) {
    return 5 * n * n; // returns 5 * n^2
}
