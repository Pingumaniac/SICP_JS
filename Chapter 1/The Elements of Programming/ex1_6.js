function conditional(predicate, then_clause, else_clause) {
    return predicate ? then_clause : else_clause;
}

console.log(conditional(2 === 3, 0, 5)); // 5
console.log(conditional(1 === 1, 0, 5)); // 0

function square(x) {
    return x * x;
}

function is_good_enough(guess, x) {
    return Math.abs(square(guess) - x) < 0.001;
}

function average(x, y) {
    return (x + y) / 2;
}

function improve(guess, x) {
    return average(guess, x / guess);
}

function sqrt_iter_original(guess, x) {
    return is_good_enough(guess, x) ? guess : sqrt_iter_original(improve(guess, x), x);
}

function sqrt_iter(guess, x) {
    return conditional(is_good_enough(guess, x), guess, sqrt_iter(improve(guess, x), x));
}

function sqrt(x) {
    return sqrt_iter(1, x);
}

/*
Here the original if statement is replaced by the conditional function.

The original 'if' is a restricted type of conditional that can be used when there are precisely two cases in the case analysis.
The general form of an if expression is

(predicate) ? (consequent) : (alternative)

To evaluate an if expression, the interpreter starts by evaluating the (predicate) part of the expression.
If the (predicate) evaluates to a true value, the interpreter then evaluates the (consequent) and returns its value.
Otherwise it evaluates the (alternative) and returns its value.

Notice that the original if follows applicative-order evaluation where either
(consequent) or (alternative) is evaluated depending on the (predicate) value.

But the new conditional function does not evaluates in this way so it does not stop
evaluating the (alternative) which is

sqrt_iter(improve(guess, x), x)

function square(x) {
                ^
RangeError: Maximum call stack size exceeded
*/
