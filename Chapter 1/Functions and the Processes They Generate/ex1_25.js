function square(x) {
    return x*x;
}

function is_even(n) {
    return n % 2 === 0;
}

function expmod_original(base, exp, m) {
    return exp === 0 ? 1 : is_even(exp) ? square(expmod(base, exp / 2, m)) % m : (base * expmod(base, exp - 1, m)) % m;
}

function expmod(base, exp, m) {
    return fast_expt(base, exp) % m;
}

// I think the modified exmod is slower.
// It's slower because it has to do more calculations than the original
// by producing higher value for base ^ exp before doing modulo m.
