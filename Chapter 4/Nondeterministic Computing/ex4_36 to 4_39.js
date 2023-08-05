function require(p) { if (!p) { amb(); } else {} }
function an_element_of(items) {
    require(items !== null);
    return amb(items[0], an_element_of(items[1]));
}
function an_integer_starting_from(n) { return amb(n, an_integer_starting_from(n + 1)); }
function an_integer_between(low, high) {
    require(low <= high);
    return amb(low, an_integer_between(low + 1, high));
}
function distinct(items) {
    return items === null ? true : items[1] === null ? true: member(items[0], items[1]) === null ?
        distinct(items[1]) : false;
}
function office_move_original() {
    const alyssa = amb(1, 2, 3, 4, 5);
    const ben = amb(1, 2, 3, 4, 5);
    const cy = amb(1, 2, 3, 4, 5);
    const lem = amb(1, 2, 3, 4, 5);
    const louis = amb(1, 2, 3, 4, 5);
    require(distinct([alyssa, ben, cy, lem, louis]));
    require(alyssa !== 5);
    require(ben !== 1);
    require(cy !== 5);
    require(cy !== 1);
    require(lem > ben);
    require(Math.abs(louis - cy) !== 1);
    require(Math.abs(cy - ben) !== 1);
    return [["alyssa", alyssa], ["ben", ben], ["cy", cy], ["lem", lem], ["louis", louis]];
}

// ex 4.36
function office_move() {
    const alyssa = amb(1, 2, 3, 4, 5);
    const ben = amb(1, 2, 3, 4, 5);
    const cy = amb(1, 2, 3, 4, 5);
    const lem = amb(1, 2, 3, 4, 5);
    const louis = amb(1, 2, 3, 4, 5);
    require(distinct([alyssa, ben, cy, lem, louis]));
    require(alyssa !== 5);
    require(ben !== 1);
    require(cy !== 5);
    require(cy !== 1);
    require(lem > ben);
    require(Math.abs(cy - ben) !== 1);
    return [["alyssa", alyssa], ["ben", ben], ["cy", cy], ["lem", lem], ["louis", louis]];
}
/*
The number of solutions in the modified puzzle = number of times retry can be called until no
more solution is found.

ex 4.37
The order of restrictions in the office-move function does not affect the ansewr.
However, it affects the run-time to find the answer. IT makes a faster program
obtained from the given one by reordering the restrictions in the office_move function.
Because the following line is most time consuming:
require(distinct([alyssa, ben, cy, lem, louis]));

But in a simple problem, the order of restrictions can only slightly affect the run-time.
By contrast, in more complex problems, the order of restrictions can affect the run-time a lot.
*/
function office_move_faster() {
    const alyssa = amb(1, 2, 3, 4, 5);
    const ben = amb(1, 2, 3, 4, 5);
    const cy = amb(1, 2, 3, 4, 5);
    const lem = amb(1, 2, 3, 4, 5);
    const louis = amb(1, 2, 3, 4, 5);
    require(alyssa !== 5);
    require(ben !== 1);
    require(cy !== 5);
    require(cy !== 1);
    require(lem > ben);
    require(Math.abs(louis - cy) !== 1);
    require(Math.abs(cy - ben) !== 1);
    require(distinct([alyssa, ben, cy, lem, louis])); // Reordered this requirement to the end
    return [["alyssa", alyssa], ["ben", ben], ["cy", cy], ["lem", lem], ["louis", louis]];
}

/*
ex 4.38
Possibilites without distinct constraint: 5^5 = 3125
Possibilites with distinct constraint: 5! = 120
*/
function office_move_efficient() {
    const alyssa = amb(1, 2, 3, 4); // 5 is excluded due to requirement below
    require(alyssa !== 5);
    const ben = amb(2, 3, 4, 5); // 1 is excluded due to requirement below
    require(ben !== 1);
    const cy = amb(1, 2, 3, 4); // 5 is excluded due to requirement below
    require(cy !== 5 && cy !== 1);
    require(Math.abs(cy - ben) !== 1); // Additional constraint on Cy and Ben
    const lem = amb(1, 2, 3, 4, 5);
    require(lem > ben); // Additional constraint on Lem and Ben
    const louis = amb(1, 2, 3, 4, 5);
    require(distinct([alyssa, ben, cy, lem, louis]));
    return [["alyssa", alyssa], ["ben", ben], ["cy", cy], ["lem", lem], ["louis", louis]];
}
// ex 4.39
function distinct(items) { return new Set(items).size === items.length; }
function office_move_ordinary() {
    for (let alyssa = 1; alyssa <= 4; alyssa++) {
        for (let ben = 2; ben <= 5; ben++) {
            for (let cy = 1; cy <= 4; cy++) {
                for (let lem = 1; lem <= 5; lem++) {
                    for (let louis = 1; louis <= 5; louis++) {
                        if (alyssa !== 5 && ben !== 1 && cy !== 5 && cy !== 1 && lem > ben &&
                            Math.abs(louis - cy) !== 1 && Math.abs(cy - ben) !== 1 &&
                            distinct([alyssa, ben, cy, lem, louis])) {
                            return [["alyssa", alyssa], ["ben", ben], ["cy", cy], ["lem", lem], ["louis", louis]];
                        }
                    }
                }
            }
        }
    }
    return null;
}


