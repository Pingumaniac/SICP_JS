function pair(x, y) {
    function dispatch(m) {
        return m === 0 ? x : m === 1 ? y : error(m, "Argument not 0 or 1 -- pair");
    }
    return dispatch;
}

function head(z) { return z(0); }
function tail(z) { return z(1); }

const gcd = (a, b) => {
    return b === 0 ? a : gcd(b, a % b);
};

const make_rat = (n, d) => {
    const g = gcd(n, d);
    const sign = n / d >= 0 ? 1 : -1;
    return pair(sign * Math.abs(n / g),  Math.abs(d / g));
};

console.log(head(make_rat(1, 2)), tail(make_rat(1, 2)));
console.log(head(make_rat(-4, 6)), tail(make_rat(-4, 6)));
