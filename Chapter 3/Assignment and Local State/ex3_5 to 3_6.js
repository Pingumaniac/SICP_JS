function estimate_pi(trials) {
    return Math.sqrt(6 / monte_carlo(trials, () => random_gcd_test(trials, Math.random())));
}
function monte_carlo(trials, experiment) {
    function iter(trials_remaining, trials_passed) {
        if(trials_remaining === 0) {
            return trials_passed / trials;
        }
        return experiment() ? iter(trials_remaining - 1, trials_passed + 1) : iter(trials_remaining - 1, trials_passed);
    }
    return iter(trials, 0);
}
function random_gcd_test(trials, initial_x) {
    function iter(trials_remaining, trials_passed, x) {
        if(trials_remaining === 0) {
            return trials_passed / trials;
        }
        const x1 = Math.random();
        const x2 = Math.random();
        return gcd(x1, x2) === 1 ?
            iter(trials_remaining - 1, trials_passed + 1, x1) : iter(trials_remaining - 1, trials_passed, x1);
    }
    return iter(trials, 0, initial_x);
}
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}
function random_in_range(low, high) {
    const range = high - low;
    const random_number = Math.random();
    return low + random_number * range;
}

// ex. 3.5
const estimate_integral = (p, x1, x2, y1, y2, trials) => {
    const test_function = () => make_integral_test(p, x1, x2, y1, y2);
    const hit_count = monte_carlo(trials, test_function);
    return hit_count / trials * (x2 - x1) * (y2 - y1);
}
const make_integral_test = (p, x1, x2, y1, y2) => {
    const x = random_in_range(x1, x2);
    const y = random_in_range(y1, y2);
    return p(x, y);
}
// end of ex 3.5

// ex. 3.6
const rand = args => {
    return args === "generate" ? Math.random() : args === "reset" ? Math.random() : "Unknown request -- rand";
}
// end of ex 3.6
