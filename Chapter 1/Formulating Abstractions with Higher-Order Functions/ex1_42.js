const compose = (f, g) => {
    return x => f(g(x));
}

const inc = x => x + 1;

const square = x => x * x;

console.log(compose(square, inc)(6)); // 49
