const filtered_accumulate = (combiner, nullValue, term, a, next, b, filter) => {
    const iter = (a, result) => {
        return a > b ? result : filter(a) ? iter(next(a), combiner(result, term(a))) : iter(next(a), result);
    }
    return iter(a, nullValue);
}

const square = (x) => {
    return x * x;
}

const inc = (x) => {
    return x + 1;
}

const prime = (x) => {
    const iter = (x, i) => {
        return i > Math.sqrt(x) ? true : x % i === 0 ? false : iter(x, i + 1);
    }
    return iter(x, 2);
}

// Part (a)
const sum_of_squares_of_prime = (a, b) => {
    return filtered_accumulate((x, y) => x + y, 0, square, a, inc, b, prime);
}

const gcd = (m, n) => {
    return m === n ? m : m < n ? gcd(m, n - m) : gcd(m - n, n);
}

// Part (b)
const relative_prime = (m, n) => {
    return gcd(m, n) === 1;
}

const product_of_relative_primes = (n) => {
    const filter = (x) => {
        return relative_prime(x, n);
    }
    return filtered_accumulate((x, y) => x * y, 1, identity, 1, inc, n, filter);
}
