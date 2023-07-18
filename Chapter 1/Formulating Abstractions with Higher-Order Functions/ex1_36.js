const tolrance = 0.00001;
const fixed_point = (f, first_guess) => {
    const close_enough = (v1, v2) => {
        return Math.abs(v1 - v2) < tolrance;
    }

    const try_with = (guess) => {
        let next = f(guess);
        console.log("next:", next);
        return close_enough(guess, next) ? next : try_with(next);
    }

    return try_with(first_guess);
}

const x_to_the_x = (y) => {
    return fixed_point(x => Math.log(y) / Math.log(x), 10.0);
}

console.log(x_to_the_x(1000));
