console.log((n => (fact => fact(fact, n)) ((ft, k) => k === 1 ? 1 : k * ft(ft, k - 1)))(10));
/*
Part (a)
Breakdown of steps:

1. (n => ... )(10) creates a function that takes a number n and applies this function to 10.
2. (fact => fact(fact, n)) creates a function that takes another function fact
and applies fact to itself and n.
3. ((ft, k) => k === 1 ? 1 : k * ft(ft, k - 1)) is the actual recursive function to calculate
the factorial.
Analogous expression for computing Fibonacci numbers:
*/
console.log((n => (fib => fib(fib, n)) ((fb, k) => k <= 2 ? 1 : fb(fb, k - 1) + fb(fb, k - 2)))(10));
// Part (b)
function f_original(x) {
    function is_even(n) {
        return n === 0 ? true : is_odd(n - 1);
    }
    function is_odd(n) {
        return n === 0 ? false : is_even(n - 1);
    }
    return is_even(x);
}

function f(x) {
    return ((is_even, is_odd) => is_even(is_even, is_odd, x))
    ((is_ev, is_od, n) => n === 0 ? true : is_od(is_ev, is_od, n - 1),
    (is_ev, is_od, n) => n === 0 ? false : is_ev(is_ev, is_od, n - 1));
}
