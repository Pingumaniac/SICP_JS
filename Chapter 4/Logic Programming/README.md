# Notes

* "In a nondeterministic language, expressions can have more than one value, and, as a result, the computation is dealing with relations rather than with single-valued functions. (438)"
* "Logic programming extends this idea by combining a relational vision of programming with a powerful kind of symbolic pattern matching called unification. (438)"
* "a single “what is” fact can be used to solve a number of different problems that would have different “how to” components. (439)"
* "“How to” knowledge is provided automatically by the interpreter to allow this single pair of rules to be used to answer all three types of questions (440)"
* "Contemporary logic programming languages (including the one we implement here) have substantial deficiencies, in that their general “how to” methods can lead them into spurious infinite loops or other undesirable behavior. (440)"
* "Logic programming is an active field of research in computer science. (440)"
* query language = "an interpreter for logic language (440)"
* "An interpreter for a logic programming language is considerably more complex than an interpreter for a language like Lisp. (441)"
* "There will be an “eval” part that classifies expressions according to type and an “apply” part that implements the language’s abstraction mechanism (procedures in the case of Lisp, and rules in the case of logic programming). (441)"
* "Also, a central role is played in the implementation by a frame data structure, which determines the correspondence between symbols and their associated values. One additional interesting aspect of our query-language implementation is that we make substantial use of streams (441)"

### Deductive Information Retrival
* "The system finds all assignments to variables in the query pattern that satisfy the pattern—that is, all sets of values for the variables such that if the pattern variables are instantiated with (replaced by) the values, the result is in the data base. (445)"
* "The system responds to the query by listing all instantiations of the query pattern with the variable assignments that satisfy it. (445)"
* "Note that if the pattern has no variables, the query reduces to a determination of whether that pattern is in the data base. (445)"
* "If so, the empty assignment, which assigns no values to variables, satisfies that pattern for that data base. (445)"
