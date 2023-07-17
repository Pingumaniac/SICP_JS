console.log(10); // Output: 10
console.log(5 + 3 + 4); // Output: 12
console.log(9 - 1); // Output: 8
console.log(6 / 2); // Output: 3
console.log(2 * 4 + (4 - 6)); // Output: 6

const a = 3;
console.log(a); // Output: 3

const b = a + 1;
console.log(b); // Output: 4

console.log(a + b + a * b); // Output: 19
console.log(a === b); // Output: false
console.log(b > a && b < a * b ? b : a); // Output: 4

console.log(a === 4 ? 6 : b === 4 ? 6 + 7 + a : 25); // Output: 16
console.log(2 + (b > a ? b : a)); // Output: 6
console.log((a > b ? a : a < b ? b : -1) * (a + 1)); // Output: 16
