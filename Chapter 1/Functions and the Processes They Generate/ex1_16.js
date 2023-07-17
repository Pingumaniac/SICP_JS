function expt_recursive(b, n) {
    return n === 0 ? 1 : b * expt_recursive(b, n - 1);
}

function expt_iterative(b, n) {
    return expr_iter(b, n, 1);
}

function expr_iter(b, counter, product) {
    return counter === 0 ? product : expr_iter(b, counter - 1, product * b);
}

function is_even(n) {
    return n % 2 === 0;
}

function square(x) {
    return x * x;
}

function fast_expt(b, n) {
    return n === 0 ? 1 : is_even(n) ? square(fast_expt(b, n / 2)) : b * fast_expt(b, n - 1);
}

// Solution
const fast_expt_iterative = (b, n) => {
    const iterative = (num, base, process_a) => {
        return num === 0 ? process_a : is_even(num) ? iterative(num / 2, square(base), process_a) : iterative(num - 1, base, base * process_a);
    };
    return iterative(n, b, 1);
};

console.log(fast_expt_iterative(2, 10)); // returns 1024


