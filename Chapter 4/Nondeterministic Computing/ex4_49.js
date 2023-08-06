// ex 4.49
let count = 0;

function choose_two_distinct_elements() {
    let x = an_element_of("a", "b", "c");
    let y = an_element_of("a", "b", "c");
    require(x !== y);
    count = count + 1;
    return list(x, y, count);
}
/*
The values that would have been displayed if we had used the original meaning of assignment
rather than permanent assignment is

["a", ["b", [1, null]]]
["a", ["c", [1, null]]]
*/
