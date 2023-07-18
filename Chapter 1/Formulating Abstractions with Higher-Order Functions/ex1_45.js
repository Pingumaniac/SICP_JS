const compose = (f, g) => {
    return x => f(g(x));
}

const repeated = (f, n) => {
    return n === 1 ? f : compose(f, repeated(f, n - 1));
}

const average = (x, y) => (x + y) / 2;

function average_damp(f) {
    return x => average_damp(x , f(x));
}

const tolerance = 0.00001;

const fixed_point = (f, first_guess) => {
    const close_enough = (v1, v2) => Math.abs(v1 - v2) < tolerance;
    const try_fixed = (guess) => {
        const next = f(guess);
        return close_enough(guess, next) ? next : try_fixed(next);
    }
    return try_fixed(first_guess);
}

const square = x => x * x;

const fast_expt = (b, n) => {
    return n === 0 ? 1 : (n % 2 === 0 ? square(fast_expt(b, n / 2)) : b * fast_expt(b, n - 1));
}

const nth_roots_as_fixed_point = (n, x) => {
    return fixed_point(repeated(average_damp, n - 1)(y => x / fast_expt(y, n - 1)), 1.0);
}
