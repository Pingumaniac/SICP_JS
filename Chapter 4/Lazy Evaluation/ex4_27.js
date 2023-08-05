function square(x) { return x * x; }
let count = 0;
function id(x) {
    count = count + 1;
    return x;
}
console.log(square(id(10))); // 100 for both with and without memoization
console.log(count); // 1 for memoization and 2 for without memoization
// 2 for without memoization because the function id is called twice,
// square(id(10)) => id(10) * id(10)
