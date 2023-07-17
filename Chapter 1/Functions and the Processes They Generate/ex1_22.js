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
    return square(test_divisor) > n ? n : divides(test_divisor, n) ? test_divisor : find_divisor(n, test_divisor + 1);
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

function timed_prime_test(n) {
    console.log(n);
    return start_prime_test(n, get_time());
}

function start_prime_test(n, start_time) {
    return is_prime(n) ? report_prime(get_time() - start_time) : false;
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
I think it supports the sqrt(n) prediction for the timing
I think the result is compatible with the notion that programs on my machine run in time
proprotional to the number of steps required for the computation.
*/
