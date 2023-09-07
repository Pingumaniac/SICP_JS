/*
Dead code elimination is done in the compiler's middleware part - program analysis.

There are two types of program analysis: static analysis and dynamic analysis.

Static analysis is done without executing the program. It is done by analyzing the source code.
Here the dead code can be eliminated at compilation level.

Dynamic analysis is done by executing the program. It is done by analyzing the program's behavior.
The dead code can be eliminated only if the program is executed.

Types of dead codes:
1. codes following a return statement in a sequence.
2. unreachable codes such as codes that will be executed if (false) { ... }
3. endless loops and halting problem.
*/
