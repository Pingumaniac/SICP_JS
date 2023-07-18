function square(x) {
    return x*x;
}

function is_even(n) {
    return n % 2 === 0;
}

function expmod(base, exp, m) {
    return exp === 0 ? 1 : is_even(exp) ? square(expmod(base, exp / 2, m)) % m : (base * expmod(base, exp - 1, m)) % m;
}

function fermat_test(n) {
    function try_it(a) {
        return expmod(a, n, n) === a;
    }
    return try_it(1 + Math.floor(Math.random() * (n - 1)));
}

const carmichael_test = (n) => {
    const carmichael_iter = (n, a) => {
       return n === 0 || n === 1 ? false : a === n ? true : expmod(a, n, n) !== (a % n) ? false : carmichael_iter(n, a + 1);
    }
    return carmichael_iter(n, 1);
}

console.log(carmichael_test(561)); // true
console.log(carmichael_test(1105)); // true
console.log(carmichael_test(1729)); // true
console.log(carmichael_test(2465)); // true
console.log(carmichael_test(2821)); // true
console.log(carmichael_test(6601)); // true
console.log(carmichael_test(8911)); // true
