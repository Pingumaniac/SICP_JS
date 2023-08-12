function count(n) {
    display(n);
    count(n + 1); // the absence of a return statement will lead to stack overflow error
}
