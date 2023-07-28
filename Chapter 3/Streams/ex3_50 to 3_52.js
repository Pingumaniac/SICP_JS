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

// ex 3.50
function stream_map_2(f, s1, s2) {
    if (s1 === null || s2 === null) {
        return null;
    } else {
        return [f(s1[0], s2[0]), () => stream_map_2(f, stream_tail(s1), stream_tail(s2))];
    }
}

function stream_map_2_optimized(f, s1, s2) {
    if (s1 === null || s2 === null) {
        return null;
    } else {
        return [f(s1[0], s2[0]), memo(() => stream_map_2_optimized(f, stream_tail(s1), stream_tail(s2)))];
    }
}
// end of ex 3.50

// ex 3.51
let x = stream_map(console.log, stream_enumerate_interval(0, 10)); // 0
stream_ref(x, 5); // 1 2 3 4 5
stream_ref(x, 7); // 1 2 3 4 5 6 7

let m = stream_map_optimized(console.log, stream_enumerate_interval(0, 10)); // 0
stream_ref(m, 5); // 1 2 3 4 5
stream_ref(m, 7); // 6 7
// end of ex 3.51

// ex 3.52
let sum = 0;
function accum(x) { sum = sum + x; return sum; }
const seq = stream_map(accum, stream_enumerate_interval(1, 20));
console.log("Sum:", sum);
const y = stream_filter(x => x % 2 === 0, seq);
console.log("Sum:", sum);
const z = stream_filter(x => x % 5 === 0, seq);
console.log("Sum:", sum);
stream_ref(y, 7); // no printed response
console.log("Sum:", sum);
display_stream(z); // 15 180 230 305
console.log("Sum:", sum);

/*
Would these responses differ if we had applied the function memo on every tail of every constructed
stream pair, as suggested in the text?

Answer: No, because the memo function only memoize the result of the function, not the function itself.
Check out the result of the following code (they produce the same result):
*/
sum = 0;
const seq_optimized = stream_map_optimized(accum, stream_enumerate_interval(1, 20));
console.log("Sum:", sum);
const y_optimized = stream_filter(x => x % 2 === 0, seq);
console.log("Sum:", sum);
const z_optimized = stream_filter(x => x % 5 === 0, seq);
console.log("Sum:", sum);
stream_ref(y_optimized, 7); // no printed response
console.log("Sum:", sum);
display_stream(z_optimized); // 15 180 230 305
console.log("Sum:", sum);
