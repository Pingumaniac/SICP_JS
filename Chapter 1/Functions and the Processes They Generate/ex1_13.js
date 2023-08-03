/*
Statement: Fib(n) is closest to [(1 + sqrt(5)) / 2]**n / sqrt(5)
let {(1 + sqrt(5)) / 2} = a, {(1 - sqrt(5)) / 2} = b

Step 1: Show that the statement is true for n = 1

LHS = Fib(1) = [{(1 + sqrt(5)) / 2} - {(1 - sqrt(5)) / 2}] / sqrt(5) = 1

Step 2: Assume that the statement is true for n = k

Step 3: Show that the statement is true for n = k + 1

LHS = Fib(k + 1) = Fib(k) + Fib(k - 1)
= (a**k - b***k) / sqrt(5) + (a**(k - 1) - b**(k - 1)) / sqrt(5)
= (a**k + a**(k - 1) - b**k - b**(k - 1)) / sqrt(5)
= (a**(k - 1) * (a + 1) - b**(k - 1) * (b + 1)) / sqrt(5)
= ...
= (a**(k + 1) - b**(k + 1)) / sqrt(5)
= RHS

Q.E.D.
*/
