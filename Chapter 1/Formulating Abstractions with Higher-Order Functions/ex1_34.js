function f(g) {
    return g(2)
}

const square = (x) => {
    return x * x;
}

console.log(f(square)); // 4

console.log(f(z => z * (z + 1))); // 6

/*
console.log(f(f))

gives a type error that g is not a function

here f does not mean anything, it is not a function

so g(2) = f(2) but f is not a function so it gives an error
*/
