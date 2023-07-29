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

// ex 3.59
const integrate_series = (s) => {
    return [0, () => add_streams(scale_stream(s, 1 / 2), integrate_series(stream_tail(s)))];
}
const exp_series = [1, () => integrate_series(exp_series)];
const cosine_series = [1, () => integrate_series(stream_map(x => -x, stream_tail(s)))];
const sine_series = [0, () => integrate_series(stream_tail(s))];

// ex 3.60
const mul_series = (s1, s2) => {
    return [s1[0] * s2[0], () => add_streams(scale_stream(s1, s2[0]), mul_series(stream_tail(s1), stream_tail(s2)))];
}
const cosine_square_series = mul_series(cosine_series, cosine_series);
const sine_square_series = mul_series(sine_series, sine_series);
const one = add_streams(cosine_square_series, sine_square_series);
console.log(one);

// ex 3.61
const invert_unit_series = (s) => {
    return [1 / s[0], () => scale_stream(invert_unit_series(s), -s[0])];
}

// ex 3.62
const div_series = (s1, s2) => {
    return [s1[0] / s2[0], () => scale_stream(div_series(s1, s2), -s1[0] / s2[0])];
}
