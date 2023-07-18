const cont_frac = (n, d, k) => {
    const rec = (x) => {
        return x > k ? 0 : n(x) / (d(x) + rec(x + 1));
    }
    return rec(1);
}

const tan_cf = (x, k) => {
    return cont_frac((i) => i === 1 ? x : -x * x, (i) => i * 2 - 1, k);
}

console.log(tan_cf(Math.PI / 4, 1000)); // 1
