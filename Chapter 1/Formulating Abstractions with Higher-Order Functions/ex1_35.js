const tolrance = 0.00001;
const fixed_point = (f, first_guess) => {
    const close_enough = (v1, v2) => {
        return Math.abs(v1 - v2) < tolrance;
    }

    const try_with = (guess) => {
        let next = f(guess);
        return close_enough(guess, next) ? next : try_with(next);
    }

    return try_with(first_guess);
}

console.log(fixed_point(x => 1 + 1 / x, 1.0)); // 1.6180327868852458
