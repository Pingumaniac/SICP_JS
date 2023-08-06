function conditional(predicate, then_clause, else_clause) {
    return predicate ? then_clause : else_clause;
}

// Original square
const square = x => x * x;
const is_good_enough = (guess, x) => Math.abs(square(guess) - x) < 0.001;
const average = (x, y) => (x + y) / 2;
const improve = (guess, x) => average(guess, x / guess);
function sqrt_iter_original(guess, x) {
    return is_good_enough(guess, x) ? guess : sqrt_iter_original(improve(guess, x), x);
}
function sqrt_iter(guess, x) {
    return conditional(is_good_enough(guess, x), guess, sqrt_iter(improve(guess, x), x));
}
const sqrt = x => sqrt_iter(1, x);

// Modified to cube
const cube = x => x * x * x;
const is_good_enough_cube = (guess, x) => Math.abs(cube(guess) - x) < 0.001;
const improve_cube = (guess, x) => (x / (guess * guess) + 2 * guess) / 3;
function cube_root_iter(guess, x) {
    return conditional(is_good_enough_cube(guess, x), guess, cube_root_iter(improve_cube(guess, x), x));
}
const cube_root = x => cube_root_iter(1, x);
