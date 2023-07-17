const sum_of_squares = (x, y) => {
    return x*x + y*y;
};

const sum_of_two_larger_numbers = (x, y, z) => {
    if (x < y) {
        if (y < z) {
            return sum_of_squares(y, z);
        } else {
            return sum_of_squares(x, y);
        }
    } else {
        if (y < z) {
            return sum_of_squares(x, z);
        } else {
            return sum_of_squares(x, y);
        }
    }
};

console.log(sum_of_two_larger_numbers(1, 2, 3)); // 13
console.log(sum_of_two_larger_numbers(6, 5, 4)); // 61
console.log(sum_of_two_larger_numbers(6, 4, 5)); // 61
