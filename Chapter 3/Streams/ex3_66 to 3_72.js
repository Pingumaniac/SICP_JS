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

// ex 3.66
const order_of_pair = (m, n) => {
    if (m === n) {
        return 2**m -2;
    } else if (m < n) {
        return 2**m * (n-m) + 2**(m-1) - 2;
    } else {
        throw new Error("m must be less than or equal to n");
    }
}
console.log(order_of_pair(1, 1)); // order of pair(1, 1) starts from 0
console.log(order_of_pair(1, 100));
console.log(order_of_pair(99, 100));
console.log(order_of_pair(100, 100));

// ex 3.67
/* Modification of pairs so that it will produce the stream of all pairs of integers
(i, j) without the condition i <=j. Mix in an additional stream */
function pairs_modified(s, t) {
    return [[s[0], s[1]],
    () => interleave(stream_map(x => [s[0], x], stream_tail(t)),
    interleave(stream_map(x => [x, s[1]], stream_tail(s)), [stream_tail(s), stream_tail(t)]))];
}

// ex 3.68
function pairs_louis(s, t) {
    return interleave(stream_map(x => [s[0], x], stream_tail(t)), [stream_tail(s), stream_tail(t)]);
}
/*
Louis idea: instead of seperating the pair (s[0], t[0]) from the rest of the pairs in the 1st row,
work with the whole 1st row.

This does not work because the 1st row is infinite, so we cannot get the 2nd row (which is also infinite
but we can get the 1st element of it.

So it causes an infinite loop.
*/

// ex 3.69
const triples = (S, T, U) => {
    return [[S[0], T[0], U[0]], () => interleave(
        stream_map(x => [S[0], x], stream_tail(T)),
        triples(stream_tail(S), stream_tail(T), stream_tail(U)))];
}
const pythagorean_triples = () => {
    const integers = integers_starting_from(1);
    const triples_stream = triples(integers, integers, integers);
    return stream_filter(x => x[0]**2 + x[1]**2 === x[2]**2, triples_stream);
}

// ex 3.70
const weighted_pairs = (s, t, weight) => {
    return [[s[0], t[0]], () => interleave(
        stream_map(x => [s[0], x], stream_tail(t)),
        scale_stream(weighted_pairs(stream_tail(s), stream_tail(t), weight), weight))];
}

// the stream of all pairs of +ve (i, j) with i <= j ordered according to the sum i + j
const pairs_sum_a = (s, t) => {
    return weighted_pairs(s, t, 1);
}
// the stream of all pairs of +ve (i, j) with i <= j ordered according to the sum i + j where
// neither i nor j is divisible by 2, 3, or 5, and the pairs are ordered according to the sum
// 2i + 3j + 5k
const pairs_sum_b = (s, t) => {
    const s1 = stream_filter(x => x % 2 !== 0, s);
    const t1 = stream_filter(x => x % 2 !== 0, t);
    const s2 = stream_filter(x => x % 3 !== 0, s1);
    const t2 = stream_filter(x => x % 3 !== 0, t1);
    const s3 = stream_filter(x => x % 5 !== 0, s2);
    const t3 = stream_filter(x => x % 5 !== 0, t2);
    return weighted_pairs(s3, t3, 1);
}

// ex 3.71
const is_ramanujan = x => x[0]**3 + x[1]**3 === x[2]**3 + x[3]**3;
const ramanujan_pairs = () => {
    const integers = integers_starting_from(1);
    const pairs_stream = pairs_sum_a(integers, integers);
    return stream_filter(x => is_ramanujan(x), pairs_stream);
}

// ex 3.72
const sum_of_squares = (x, y) => x**2 + y**2;
const sum_of_two_squares_in_three_different_ways = n => {
    const integers = integers_starting_from(1);
    const pairs_stream = pairs_sum_a(integers, integers);
    const filtered_pairs = stream_filter(x => sum_of_squares(x[0], x[1]) === n, pairs_stream);
    return stream_ref(filtered_pairs, 2);
}
