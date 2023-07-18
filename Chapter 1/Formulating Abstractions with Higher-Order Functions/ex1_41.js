const double = (f) => {
    return x => f(f(x));
}

const inc = x => x + 1;

console.log(double(double)(double)(inc)(5)); // 21
