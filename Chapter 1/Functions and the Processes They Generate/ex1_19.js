function is_even(n) {
    return n % 2 === 0;
}

function fib_iter(a, b, p, q, count) {
    return count === 0 ? b : is_even(count) ? fib_iter(a, b, p*p+q*q, 2*p*q + q*q, count / 2) : fib_iter(b*q + a*q + a*p, b*p + a*q, p, q, count - 1);
}

function fib(n) {
    return fib_iter(1, 0, 0, 1, n);
}

console.log(fib(1)); // 1
console.log(fib(2)); // 1
console.log(fib(3)); // 2
console.log(fib(4)); // 3
console.log(fib(5)); // 5
console.log(fib(6)); // 8
console.log(fib(7)); // 13
console.log(fib(8)); // 21
console.log(fib(9)); // 34
console.log(fib(10)); // 55
