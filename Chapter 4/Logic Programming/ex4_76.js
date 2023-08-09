/*
Implementing for the query language a rule-application method that uses environments rather than
renaming requires signficiant changes to the interpreter and hence decided not to implement.
But this method has both advantages and disadvantages.

Advantages:
1. Modularity: the interpreter is divided into two parts: one for the query language
and the other for the rule language.
2. Efficiency: the interpreter is more efficient because it does not need to rename variables
3. Scoped Reasoning: the interpreter can reason about the scope of variables

Disadvantages:
1. Complexity: the interpreter is more complex because it needs to handle environments
2. Debugging and testing: the interpreter is more difficult to debug and testing
because it needs to handle environments
*/
