function conditional(predicate, then_clause, else_clause) {
    return predicate ? then_clause : else_clause;
}
const square = x => x * x;
const is_good_enough = (guess, x) => Math.abs(square(guess) - x) < 0.001;
/*
ex 1.7
For very small numbers: 0.001 margin can be too large.
e.g. sqrt(0.0000001) = 0.001 but having 0.001 margin is too large
For very large numbers: 0.001 margin can be too small.
e.g. sqrt(10000000) = 1000 but having 0.001 margin is too small which
can leads to computations that are expensive but not as useful.

Alternative is to use relative error:
*/
const is_good_enough_relative = (guess, x) => Math.abs(square(guess) - x) / x < 0.001;
const average = (x, y) => (x + y) / 2;
const improve = (guess, x) => average(guess, x / guess);
function sqrt_iter_original(guess, x) {
    return is_good_enough(guess, x) ? guess : sqrt_iter_original(improve(guess, x), x);
}
function sqrt_iter(guess, x) {
    return conditional(is_good_enough(guess, x), guess, sqrt_iter(improve(guess, x), x));
}
const sqrt = x => sqrt_iter(1, x);

