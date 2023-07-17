function times(a, b) {
    return b === 0 ? 0 : a + times(a, b - 1);
}

const double = (n) => {
    return n + n;
}

const halve = (n) => {
    return n / 2;
}

function is_even(n) {
    return n % 2 === 0;
}

// Solution
const mult = (a, b) => {
    return b === 0 ? 0 : is_even(b) ? double(mult(a, halve(b))) : a + mult(a, b - 1);
}

console.log(mult(3, 5)); // returns 15
