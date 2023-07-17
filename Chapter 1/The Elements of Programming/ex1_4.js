function plus(a, b) { return a + b; }
function minus(a, b) { return a - b; }
function a_plus_abs_b(a, b) {
    return (b >= 0 ? plus : minus)(a, b);
}

// This function returns the value of a + b if b is higher than 0, but returns a - b if b is lower than 0.
