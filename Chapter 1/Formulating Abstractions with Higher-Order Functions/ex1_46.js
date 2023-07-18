const iterative_improve = (good_enough, improve) => {
    const iter = (guess) => {
        return good_enough(guess) ? guess : iter(improve(guess));
    }
    return iter;
}

const tolerance = 0.00001;
const close_enough = (v1, v2) => Math.abs(v1 - v2) < tolerance;

const fixed_point = (f, first_guess) => {
    return iterative_improve(guess => close_enough(guess, f(guess)), f)(first_guess);
}

const sqrt = (x) => {
    return fixed_point(iterative_improve(y => close_enough(y * y, x), y => (y + x / y) / 2), 1.0);
}

console.log(sqrt(2)); // 1.4142156862745097
