const dx = 0.00001;

const compose = (f, g) => {
    return x => f(g(x));
}

const repeated = (f, n) => {
    return n === 1 ? f : compose(f, repeated(f, n - 1));
}

const smooth = (f) => {
    return x => (f(x - dx) + f(x) + f(x + dx)) / 3;
}

const n_fold_smoothed = (f, n) => {
    return repeated(smooth, n)(f);
}
