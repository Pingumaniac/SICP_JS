function require(p) { if (!p) { amb(); } else {} }
function an_element_of(items) {
    require(items !== null);
    return amb(items[0], an_element_of(items[1]));
}
function an_integer_starting_from(n) { return amb(n, an_integer_starting_from(n + 1)); }

function prime_sum_pair(list1, list2) {
    const a = an_element_of(list1);
    const b = an_element_of(list2);
    require(is_prime(a + b));
    return [a, b];
}
function an_integer_between(low, high) {
    require(low <= high);
    return amb(low, an_integer_between(low + 1, high));
}
function a_pythogorean_triple_between(low, high) {
    const i = an_integer_between(low, high);
    const j = an_integer_between(i, high);
    const k = an_integer_between(j, high);
    require(i * i + j * j === k * k);
    return [i, j, k];
}

// ex 4.34
function a_pythogorean_triple() {
    const i = an_integer_starting_from(1);
    const j = an_integer_starting_from(i + 1);
    const k = an_integer_starting_from(j + 1);
    require(i * i + j * j === k * k);
    return [i, j, k];
}
/*
Note that simply replacing an_integer_between with an_integer_starting_from does not work
b/c it will then generate an infinite loop for searching the integers.
*/
