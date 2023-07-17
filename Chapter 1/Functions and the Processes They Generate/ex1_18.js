const double = (n) => {
    return n + n;
}

const halve = (n) => {
    return n / 2;
}

function is_even(n) {
    return n % 2 === 0;
}

const mult_iterative = (a, b) => {
    const mult_iter = (acc, a, b) => {
        return b === 0 ? acc : is_even(b) ? mult_iter(acc, double(a), halve(b)) : mult_iter(acc + a, a, b - 1);
    }
    return mult_iter(0, a, b);
}

console.log(mult_iterative(3, 5)); // returns 15
