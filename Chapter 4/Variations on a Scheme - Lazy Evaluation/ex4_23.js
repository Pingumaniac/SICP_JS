const unless = (condition, usual_value, exceptional_value) => {
    return condition ? exceptional_value : usual_value;
};
const factorial = n => unless(n === 1, n * factorial(n - 1), 1);

console.log(factorial(5)); // 120
/*
If we attempt to evaluate factorial(5) in applicative order language, we get a stack overflow.
because

factorial(4)
factorial(3)
factorial(2)
factorial(1)
factorial(0)
factorial(-1)
...

shall be all evaluated before the multiplication can be done.
*/
