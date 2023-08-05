let count = 0;
function id(x) {
    count = count + 1;
    return x;
}
console.log(count);
const w = id(id(10));
console.log(w);
console.log(count);
/*
L-evaluate input:
count
L-evaluate value:
1
Reason: 1 not 0 for lazy evaluation. Count is incremented by 1 when the function id is defined.

L-evaluate input:
w
L-evaluate value:
10
Reason: lazy evaluation does not make a difference here.

L-evaluate input:
count
L-evaluate value:
2
Reason: lazy evaluation does not make a difference here.
*/
