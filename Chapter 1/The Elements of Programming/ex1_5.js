function p() { return p(); }

function test(x, y) {
    return x === 0 ? 0 : y;
}

test(0, p());

/*
The return value of this will not be given with an interpreter that uses applicative-order evaluation,
as p will continously defined to be p and the test function will hence never be executed.

The return value of this will be 0 with an interpreter that uses normal-order evaluation,
as the x parameter is defined as 0 and if x parameter is defined as 0 then the test function returns 0.

Note:
applicative-order evaluation: evaluate the arguments & then apply
normal-order evaluation: fully expand and then reduce
*/
