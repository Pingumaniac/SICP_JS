function cube(x) {
    return x * x * x;
}

function p(x) {
    return 3 * x - 4 * cube(x);
}

function sine(angle) {
    return !(Math.abs(angle) > 0.1) ? angle : p(sine(angle / 3));
}

/*
Answer for (a): The function is applied 5 times

sine(12.15)
-> p(sine(4.05))
-> p(p(sine(1.35)))
-> p(p(p(sine(0.45))))
-> p(p(p(p(sine(0.15)))))
-> p(p(p(p(p(sine(0.05))))))
-> p(p(p(p(p(0.05)))))

Answer for (b): The order of growth in space and number of steps is O(log a) where a is the angle in radians.
*/
