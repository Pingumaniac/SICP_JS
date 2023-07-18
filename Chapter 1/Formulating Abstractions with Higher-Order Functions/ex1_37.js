const cont_frac = (n, d, k) => {
    const rec = (x) => {
        return x > k ? 0 : n(x) / (d(x) + rec(x + 1));
    }
    return rec(1);
}

const cont_frac_iter = (n, d, k) => {
    const iter = (x, result) => {
        return x === 0 ? result : iter(x - 1, n(x) / (d(x) + result));
    }
    return iter(k, 0);
}

console.log(cont_frac((x) => 1, (x) => 1, 1000)); // 0.6180339887498949
console.log(cont_frac_iter((x) => 1, (x) => 1, 1000)); // 0.6180339887498949
