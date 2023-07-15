# Notes

Made notes of things that I have found interesting.

* "In nondeterministic Scheme the evaluation of an expression may in addition result in the discovery of a dead end, in which case evaluation must backtrack to a previous choice point. The interpretation of nondeterministic Scheme is complicated by this extra case. (426)"

### Failure continuations are constructed by

* "amb expressions—to provide a mechanism to make alternative choices if the current choice made by the amb expression leads to a dead end (428)"
* "the top-level driver—to provide a mechanism to report failure when the choices are exhausted (428)"
* "assignments—to intercept failures and undo assignments during backtracking (428)"

### "Failures are initiated only when a dead end is encountered (428)"

Conditions:
* "if the user program executes (amb) (428)"
* "if the user types try-again at the top-level driver (428)"

### "Failure continuations are also called during processing of a failure (428)"

* "When the failure continuation created by an assignment finishes undoing a side effect, it calls the failure continuation it intercepted, in order to propagate the failure back to the choice point that led to this assignment or to the top level. (428)"
* "When the failure continuation for an amb runs out of choices, it calls the failure continuation that was originally given to the amb, in order to propagate the failure back to the previous choice point or to the top level. (428)"
