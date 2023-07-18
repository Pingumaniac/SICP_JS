const compose = (f, g) => {
    return x => f(g(x));
}

const repeated = (f, n) => {
    return n === 1 ? f : compose(f, repeated(f, n - 1));
}

const inc = x => x + 1;

const square = x => x * x;

console.log(repeated(square, 2)(5)) // 625
