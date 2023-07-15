# Notes

Made notes of things that I have found interesting.

## Tail recursive evaluator

* "An evaluator that can exeecute a procedure such as sqrt-iter without requireing increasing stroage as the procedure continues to call itself (556)"
* "The only difference is that we go through the save-restore cycle for the last expression in a sequence as well as for the others. (557)"
* "The interpreter will still give the same value for any expression. (557)"
* "But this change is fatal to the tail-recursive implementation, because we must now return after evaluating the final expression in a sequence in order to undo the (useless) register saves. (557)"
* "These extra saves will accumulate during a nest of procedure calls. (557)"
* "Consequently, processes such as sqrtiter will require space proportional to the number of iterations rather than requiring constant space. (557)"
* "With tail recursion, an infinite loop can be expressed using only the procedure-call mechanism. (558)"
* "Without tail recursion, such a procedure would eventually run out of stack space, and expressing a true iteration would require some control mechanism other than procedure call. (558)"
