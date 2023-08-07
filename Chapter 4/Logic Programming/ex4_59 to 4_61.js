/*
ex 4.59
rule(next_to_in($x, $y, [$x, [$y, $u]]));
rule(next_to_in($x, $y, [$v, $z]), next_to_in($x, $y, $z));

Query input:
next_to_in($x, $y, [1, [2, 3], 4]);

Query output:
next_to_in(1, [2, 3], [1, [2, 3], 4]);
next_to_in([2, 3], 4, [1, [2, 3], 4]);

Query input:
next_to_in($x, 1, [2, 1, 3, 1]);

Quey output:
next_to_in(2, 1, [2, 1, 3, 1]);
next_to_in(3, 1, [2, 1, 3, 1]);

ex 4.60
let recursive_rule = rule(last_pair([$u, $v], $x), last_pair($v, $x));
let base_case_rule = rule(last_pair([$x], $x));

Query input: last_pair([3], $x)
Query output: last_pair([3], [3])

Query input: last_pair([1, 2, 3], ?x)
Query output: last_pair([1, 2, 3], [3])

Query input: last_pair([2, ?x], [3])
Query output: last_pair([2, 3], [3])

Do your rules work correctly on queries such as last_pair (?x, (3))?
No. This causes an infinite loop.

ex 4.61
The following data base (see Genesis 4) traces
the genealogy of the descendants of Ada back to Adam, by
way of Cain:
son("Adam", "Cain")
son("Cain", "Enoch")
son("Enoch", "Irad")
son("Irad", "Mehujael")
son("Mehujael", "Methushael")
son("Methushael", "Lamech")
wife("Lamech", "Ada")
son("Ada", "Jabal")
son("Ada", "Jubal")


// “If S is the son of F , and F is the son of G, then S is the grandson of G”
rule(grandson($S, $G), and(son($F, $S), son($G, $F))).

// “If W is the wife of M, and S is the son of W, then S is the son of M”
rule(son($M, $S), and(wife($M, $W), son($W, $S))).

// "the grandson of Cain"
grandson(Cain, $G)

// "the son of Lamech"
son(Lamech, $S)

// "the grandson of Methushael"
grandson(Methushael, $G)
*/
