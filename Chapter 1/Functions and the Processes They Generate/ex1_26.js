function square(x) {
    return x*x;
}

function is_even(n) {
    return n % 2 === 0;
}

function expmod_original(base, exp, m) {
    return exp === 0 ? 1 : is_even(exp) ? square(expmod_original(base, exp / 2, m)) % m : (base * expmod_original(base, exp - 1, m)) % m;
}

function expmod(base, exp, m) {
    return exp === 0 ? 1 : is_even(exp) ? (expmod(base, exp / 2, m) * expmod(base, exp / 2, m)) % m : (base * expmod(base, exp - 1, m)) % m;
}

/*
For the original function, the case when exp is even is
you calculate expmod(base 2n m) only once and do a square on it
But for the new function, you have to calculate expmod(base n m) two times and then multiply them

So the original function -> O(log n)
new function -> O(n)
*/

