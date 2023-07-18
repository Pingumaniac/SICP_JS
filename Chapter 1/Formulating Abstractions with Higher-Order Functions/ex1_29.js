function cube(x) {
    return x*x*x;
}

const simpsonIntegral = (f, a, b, n) => {
    const sum = (term, a, next, b) => {
        return a > b ? 0 : term(a) + sum(term, next(a), next, b);
    }

    const term = (x) => {
        let h = (b - a) / n;
        return f(x) + 4 * f(x + h) + f(x + 2 * h);
    }

    const next = (x) => {
        let h = (b - a) / n;
        return x + 2 * h;
    }

    let h = (b - a) / n;
    return (h / 3) * sum(term, a, next, b - 2 * h);
}

console.log(simpsonIntegral(cube, 0, 1, 100)); // 0.23
console.log(simpsonIntegral(cube, 0, 1, 1000)); // 0.24
console.log(simpsonIntegral(cube, 0, 1, 10000)); // 0.25
