function stream_tail(stream) { return stream[1](); }
function stream_ref(s, n) { return n === 0 ? s[0] : stream_ref(stream_tail(s), n - 1); }
function stream_map(f, s) { return s === null ? null : [f(s[0]), () => stream_map(f, stream_tail(s))]; }
function stream_for_each(fun, s) {
    if (s === null) {
        return true;
    } else {
        fun(s[0]);
        return stream_for_each(fun, stream_tail(s));
    }
}
function display_stream(s) { return stream_for_each(console.log, s); }
function stream_enumerate_interval(low, high) {
    return low > high
           ? null
           : [low, () => stream_enumerate_interval(low + 1, high)];
}
function stream_filter(pred, stream) {
    return stream === null
           ? null
           : pred(stream[0])
             ? [stream[0], () => stream_filter(pred, stream_tail(stream))]
             : stream_filter(pred, stream_tail(stream));
}
function memo(fun) {
    let already_run = false;
    let result = undefined;
    return () => {
        if (!already_run) {
            result = fun();
            already_run = true;
        }
        return result;
    };
}
function stream_map_optimized(f, s) {
    return s === null ? null : [f(s[0]), memo(() => stream_map_optimized(f, stream_tail(s)))];
}

function stream_map_2(f, s1, s2) {
    if (s1 === null || s2 === null) { return null; }
    if (s1 === undefined || s2 === undefined) { throw new Error('Undefined stream(s) have been provided.'); }
    return [f(s1[0], s2[0]), () => stream_map_2(f, stream_tail(s1), stream_tail(s2))];
}

function stream_map_2_optimized(f, s1, s2) {
    if (s1 === null || s2 === null) {
        return null;
    } else {
        return [f(s1[0], s2[0]), memo(() => stream_map_2_optimized(f, stream_tail(s1), stream_tail(s2)))];
    }
}

function integers_starting_from(n) { return [n, () => integers_starting_from(n + 1)]; }
const integers = integers_starting_from(1);

function is_divisible(x, y) { return x % y === 0; }
const no_sevens = stream_filter(x => !is_divisible(x, 7), integers);
stream_ref(no_sevens, 100);

function fibgen(a, b) { return [a, () => fibgen(b, a + b)]; }
const fibs = fibgen(0, 1);

function sieve(stream) {
    return [stream[0], () => sieve(stream_filter(x => !is_divisible(x, stream[0]), stream_tail(stream)))];
}
const primes = sieve(integers_starting_from(2));
stream_ref(primes, 50);
const ones = [1, () => ones];

function add_streams(s1, s2) { return stream_map_2((x, y) => x + y, s1, s2); }
const integers2 = [1, () => add_streams(ones, integers2)];
const fibs2 = [0, () => [1, () => add_streams(fibs2, stream_tail(fibs2))]];

function scale_stream(stream, factor) { return stream_map(x => x * factor, stream); }
const double = [1, () => scale_stream(double, 2)];
const primes2 = [2, () => stream_filter(x => is_prime(x), integers_starting_from(3))];

function is_prime(n) {
    function iter(ps) {
        return square(head(ps)) > n ? true : is_divisible(n, head(ps)) ? false : iter(stream_tail(ps));
    }
    return iter(primes2);
}

const s = [1, () => add_streams(s, s)];
const mul_streams = (x, y) => {
    return [x[0] * y[0], () => mul_streams(stream_tail(x), stream_tail(y))];
}
const factorials = [1, () => mul_streams(factorials, integers)];

function partial_sums(s) { return [s[0], () => add_streams(partial_sums(s), stream_tail(s))]; }
function expand(num, den, radix) {
    return [Math.trunc((num * radix) / den), () => expand((num * radix) % den, den, radix)];
}
let result1 = expand(1, 7, 10);
let result2 = expand(3, 8, 10);

const integrate_series = (s) => {
    return [0, () => add_streams(scale_stream(s, 1 / 2), integrate_series(stream_tail(s)))];
}
const exp_series = [1, () => integrate_series(exp_series)];
const cosine_series = [1, () => integrate_series(stream_map(x => -x, stream_tail(s)))];
const sine_series = [0, () => integrate_series(stream_tail(s))];
const mul_series = (s1, s2) => {
    return [s1[0] * s2[0], () => add_streams(scale_stream(s1, s2[0]), mul_series(stream_tail(s1), stream_tail(s2)))];
}
const invert_unit_series = (s) => {
    return [1 / s[0], () => scale_stream(invert_unit_series(s), -s[0])];
}
const div_series = (s1, s2) => {
    return [s1[0] / s2[0], () => scale_stream(div_series(s1, s2), -s1[0] / s2[0])];
}

function sqrt_imporve(guess, x) { return (guess + x / guess) / 2; }
function sqrt_stream(x) {
    return [1, () => stream_map(guess => sqrt_imporve(guess, x), sqrt_stream(x))];
}
function pi_summand(n) {
    return [1 / (n * (n + 2)), () => stream_map(x => -x, pi_summand(n + 4))];
}
const pi_stream = scale_stream(partial_sums(pi_summand(1)), 4);

function euler_transform(s) {
    const s0 = stream_ref(s, 0);
    const s1 = stream_ref(s, 1);
    const s2 = stream_ref(s, 2);
    return [s2 - (s2 - s1) * (s2 - s1) / (s0 - 2 * s1 + s2), () => euler_transform(stream_tail(s))];
}

function make_tableau(transform, s) { return [s, () => make_tableau(transform, transform(s))]; }
const accelerated_sequence = (transform, s) => stream_map(s => stream_ref(s, 0), make_tableau(transform, s));

function sqrt_stream_optimized(x) {
    return [1, () => stream_map_optimized(guess => sqrt_imporve(guess, x), sqrt_stream_optimized(x))];
}
function sqrt_stream_optimized_2(x) {
    const guess = [1, memo(() => stream_map_optimized(guess => sqrt_imporve(guess, x), guess))];
    return guess;
}
const stream_limit = (s, tolerance) => {
    if (Math.abs(stream_ref(s, 1) - stream_ref(s, 0)) < tolerance) {
        return stream_ref(s, 1);
    } else {
        return stream_limit(stream_tail(s), tolerance);
    }
}

function sqrt(x, tolerance) { return stream_limit(sqrt_stream_optimized_2(x), tolerance); }
const ln2_summands = n => [1 / n, () => stream_map(x => -x, ln2_summands(n + 1))];
const ln2_stream = n => partial_sums(ln2_summands(n));
const ln2 = n => stream_limit(ln2_stream(n), 0.00001);

function interleave(s1, s2) { return s1 === null ? s2 : [s1[0], () => interleave(s2, s1[1]())]; }
function pairs(s, t) {
    return [[s[0], s[1]],
    () => interleave(stream_map(x => [s[0], x], stream_tail(t)), [stream_tail(s), stream_tail(t)])];
}

const order_of_pair = (m, n) => {
    if (m === n) {
        return 2**m -2;
    } else if (m < n) {
        return 2**m * (n-m) + 2**(m-1) - 2;
    } else {
        throw new Error("m must be less than or equal to n");
    }
}

function make_rand() {
    let x = Math.random();
    return () => {
        x = Math.random();
        return x;
    };
}
const random_numbers = [Math.random(), () => stream_map(Math.random, random_numbers)];
const map_successive_pairs = (f, s) => {
    return [f(stream_ref(s, 0), stream_ref(s, 1)),
        () => map_successive_pairs(f, stream_tail(stream_tail(s)))];
}
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const dirichlet_stream = map_successive_pairs((r1, r2) => gcd(r1, r2) === 1, random_numbers);
const monte_carlo = (experiment_stream, passed, failed) => {
    const next = (passed, failed) => {
        return [passed / (passed + failed),
            () => monte_carlo(stream_tail(experiment_stream), passed, failed)];
    };
    return stream_ref(experiment_stream, 0) ? next(passed + 1, failed) : next(passed, failed + 1)
}
const pi = stream_map(p => Math.sqrt(6 / p), monte_carlo(dirichlet_stream, 0, 0));

// ex 3.81
const rand = args => {
    let random_numbers = [Math.random(), () => stream_map(Math.random, random_numbers)];
    if (args === "generate") {
        return stream_map(x => x, random_numbers);
    } else if (args === "reset") {
        random_numbers = [Math.random(), () => stream_map(Math.random, random_numbers)];
        return "ok";
    } else {
        throw new Error("Unknown argument");
    }
}

// ex 3.82
const estimate_integral = (p, x1, x2, y1, y2) => {
    const random_numbers = [Math.random(), () => stream_map(Math.random, random_numbers)];
    const experiment_stream = stream_map(() => make_integral_test(p, x1, x2, y1, y2), random_numbers);
    return stream_map(p => p * (x2 - x1) * (y2 - y1), monte_carlo(experiment_stream, 0, 0));
}
const make_integral_test = (p, x1, x2, y1, y2) => {
    const x = random_in_range(x1, x2);
    const y = random_in_range(y1, y2);
    return p(x, y);
}
function random_in_range(low, high) {
    const range = high - low;
    const random_number = Math.random();
    return low + random_number * range;
}
