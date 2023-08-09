/*
Changing the query language from streaming to non-deterministic program requires signficant changes to the interpreter.
but has both advantages and disadvantages.

Advantages:
1. More efficient if only few answers are needed for a query.

Disadvantages:
1. Gives different answers for the same query when trying again.
2. Introduces latency when trying again for the same query, to reach to the valid answer
and avoid dead end.

Hence the query language interpreter uisng non-deterministic program
is not suitable for real-time applications, and decided to not implement it fully.
*/
