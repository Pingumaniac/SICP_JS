function square(x) {
    return x*x;
}

function is_even(n) {
    return n % 2 === 0;
}


const non_trivial_sqrt = (n , m) => {
    return n === 1 ? false : n = m - 1 ? false : square(n) % m === 1;
}

function expmod(base, exp, m) {
    if (exp === 0) {
        return 1;
    } else if (is_even(exp)) {
        return non_trivial_sqrt(expmod(base, exp / 2, m)) ? 0 : square(expmod(base, exp / 2, m)) % m;
    } else {
        return (base * expmod(base, exp - 1, m)) % m;
    }
}

const miller_rabin_test = (a, n) => {
    return a === 0 ? true : expmod(a, n-1, n) === 1 ? miller_rabin_test(a-1, n) : false;
}

const miller_rabin = (n) => {
    return miller_rabin_test(n-1, n);
}

console.log(miller_rabin(2)); // true
console.log(miller_rabin(3)); // true
console.log(miller_rabin(5)); // true

console.log(miller_rabin(561)); // false (this is a carmichael number)
console.log(miller_rabin(1105)); // false (this is a carmichael number)
console.log(miller_rabin(1729)); // false (this is a carmichael number)
