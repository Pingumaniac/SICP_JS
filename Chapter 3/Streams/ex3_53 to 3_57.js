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

// ex 3.53
const s = [1, () => add_streams(s, s)];
// this scales by the power of 2

// ex 3.54
const mul_streams = (x, y) => {
    return [x[0] * y[0], () => mul_streams(stream_tail(x), stream_tail(y))];
}
const factorials = [1, () => mul_streams(factorials, integers)];

// ex 3.55
function partial_sums(s) { return [s[0], () => add_streams(partial_sums(s), stream_tail(s))]; }

// ex 3.56
function merge(s1, s2) {
    if (s1 === null) { return s2; }
    if (s2 === null) { return s1; }
    const s1_head = head(s1);
    const s2_head = head(s2);
    return s1_head < s2_head ? [s1_head, () => merge(stream_tail(s1), s2)] :
              s1_head > s2_head ? [s2_head, () => merge(s1, stream_tail(s2))] :
                [s1_head, () => merge(stream_tail(s1), stream_tail(s2))];
}
const S = [1, () => merge(stream_map(x => x * 2, S), stream_map(x => x * 3, S))];

/* ex 3.57
When we compute the nth Fibonacci number using the declaration of fibs based on the add_streams function,
the number of additions performed is the golden ratio raised to the nth power.

This number is exponentially greater than the number of additions performed if add_streams had used the
function stream_map_2_optimized instead of stream_map_2. Because stream_map_2 does not use memoization,
it will recompute the same values over and over again, which is why the number of additions is
exponentially greater than the number of additions performed by stream_map_2_optimized.
*/
