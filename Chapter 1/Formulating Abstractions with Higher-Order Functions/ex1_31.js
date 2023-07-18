// Part (a)
const product = (term, a, next, b) => {
    return a > b ? 1 : term(a) * product(term, next(a), next, b);
}

const identity = (x) => {
    return x;
}

const next = (x) => {
    return x + 1;
}

const factorial = (n) => {
    return product(identity, 1, next, n);
}

console.log(factorial(5)); // 120
console.log(factorial(6)); // 720

const pi_term = (n) => {
    return n % 2 === 0 ? (n + 2) / (n + 1) : (n + 1) / (n + 2);
};


console.log(product(pi_term, 1, next, 10) * 4); // 3.27
console.log(product(pi_term, 1, next, 100) * 4); // 3.15
console.log(product(pi_term, 1, next, 1000) * 4); // 3.14

// Part (b)
const product_iter = (term, a, next, b) => {
    const iter = (a, result) => {
        return a > b ? result : iter(next(a), result * term(a));
    }
    return iter(a, 1);
}

console.log(product_iter(pi_term, 1, next, 10) * 4); // 3.27
console.log(product_iter(pi_term, 1, next, 100) * 4); // 3.15
console.log(product_iter(pi_term, 1, next, 1000) * 4); // 3.14
