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

// ex 4.33
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
