const pascal = (r, c) => {
    if (r < c || c < 1) {
        return 0;
    } else if (c === 1 || r === c) {
        return 1;
    } else {
        return pascal(r - 1, c - 1) + pascal(r - 1, c);
    }
}

console.log(pascal(1, 1)); // 1
console.log(pascal(2, 1)); // 1
console.log(pascal(3, 2)); // 2
console.log(pascal(4, 2)); // 3
console.log(pascal(5, 2)); // 4
console.log(pascal(5, 3)); // 6
console.log(pascal(6, 2)); // 5
console.log(pascal(6, 3)); // 10
console.log(pascal(7, 2)); // 6
console.log(pascal(7, 3)); // 15
