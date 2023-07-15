# Notes

Made notes of things that I have found interesting.

* "An advantage of lazy evaluation is that some procedures, such as unless, can do useful computation even if evaluation of some of their arguments would produce errors or would not terminate. (400)"
* "If the body of a procedure is entered before an argument has been evaluated we say that the procedure is non-strict in that argument. (400)"
* "If the argument is evaluated before the body of the procedure is entered we say that the procedure is strict in that argument. (400)"
* "In a purely applicative-order language, all procedures are strict in each argument. (400)"
* "In a purely normal-order language, all compound procedures are non-strict in each argument, and primitive procedures may be either strict or non-strict. (400)"
* "The delayed arguments are not evaluated; instead, they are transformed into objects called thunks. (401)"
* "The process of evaluating the expression in a thunk is called forcing. (401)"
