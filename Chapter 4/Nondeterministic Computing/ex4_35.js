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
function a_pythogorean_triple_between_original(low, high) {
    const i = an_integer_between(low, high);
    const j = an_integer_between(i, high);
    const k = an_integer_between(j, high);
    require(i * i + j * j === k * k);
    return [i, j, k];
}
function a_pythogorean_triple() {
    const i = an_integer_starting_from(1);
    const j = an_integer_starting_from(i + 1);
    const k = an_integer_starting_from(j + 1);
    require(i * i + j * j === k * k);
    return [i, j, k];
}

// ex 4.35
function a_pythogorean_triple_between(low, high) {
    const i = an_integer_between(low, high);
    const hsq = high * high;
    const j = an_integer_between(i, high);
    const ksq = i * i + j * j;
    require(hsq >= ksq);
    const k = Math.sqrt(ksq);
    require(Number.isInteger(k));
    return [i, j, k];
}
/*
Ben is correct that this is more efficient than the original function.
B/c this reduce the number of possibilities that must be explored.
By computing k directly from i and j, the code avoids having to search over all possibilities for k.
In Ben's code, there is only one k for given i and j, whereas in the original code,
there are many possibilities (high - j) for k.
*/
