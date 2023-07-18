const cont_frac = (n, d, k) => {
    const rec = (x) => {
        return x > k ? 0 : n(x) / (d(x) + rec(x + 1));
    }
    return rec(1);
}

const euler_e = (n) => {
    return cont_frac((x) => 1, (x) => x % 3 === 2 ? (x + 1) / 1.5 : 1, n) + 2;
}

console.log(euler_e(1000)); // 2.7182818284590455
