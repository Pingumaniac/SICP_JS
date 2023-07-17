function smallest_divisor(n) {
    return find_divisor(n, 2);
}

function square(x) {
    return x*x;
}

function divides(a, b) {
    return b % a === 0;
}

function find_divisor(n, test_divisor) {
    const next = (num) => {
        return num === 2 ? 3 : num + 2;
    }
    return square(test_divisor) > n ? n : divides(test_divisor, n) ? test_divisor : find_divisor(next(n), test_divisor + 1);
}

function is_prime(n) {
    return n === smallest_divisor(n);
}

function is_even(n) {
    return n % 2 === 0;
}

function expmod(base, exp, m) {
    return exp === 0 ? 1 : is_even(exp) ? square(expmod(base, exp / 2, m)) % m : (base * expmod(base, exp - 1, m)) % m;
}

function get_time() {
    // Get the current time logic here
    return new Date().getTime();
}

function fermat_test(n) {
    function try_it(a) {
        return expmod(a, n, n) === a;
    }
    return try_it(1 + Math.floor(Math.random() * (n - 1)));
}

function fast_is_prime(n, times) {
    return times === 0 ? true : fermat_test(n) ? fast_is_prime(n, times - 1) : false;
}

function timed_prime_test(n) {
    console.log(n);
    return start_prime_test(n, get_time());
}

function start_prime_test(n, start_time) {
    return fast_is_prime(n , 100) ? report_prime(get_time() - start_time) : false;
}

function report_prime(elapsed_time) {
    return console.log(" *** " + elapsed_time);
}

const search_for_primes = (low, high) => {
    const iter = (n) => {
        if (n > high) {
            return;
        }
        timed_prime_test(n);
        iter(n + 2);
    };
    return iter(low % 2 === 0 ? low + 1 : low);
};

search_for_primes(1000, 1041);
search_for_primes(10000, 10041);
search_for_primes(100000, 100041);

/*
I think the time expected to test prime near 1,000,000 to compare with the time needed
to test primes near 1000 groves linearly in terms of the number of digits of the number.
This is because the number of digits of the number is the number of times the function
expmod is called. The function expmod is called 100 times in the fast_is_prime function.
Therefore, the time needed to test primes near 1,000,000 is 100 times the time needed
to test primes near 1000.
*/
