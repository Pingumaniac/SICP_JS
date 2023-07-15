# Notes

Made notes of things that I have found interesting.

## Recursive process v.s. recursive procedure

### Quotes from page 35

Recursive procedure -> *refer[s] to a syntactic fact that the procedure definition refers (either directly or indirectly) to procedure itself.*

Recursive process -> *how te process evolves, not about the suntax of how a procedure is written.*

*One reason that the distinction between process and procedure may be confusing is that most implementations of common languages 
(including Ada, Pascal, and C) are designed in such a way that the interpretation of any recursive procedure consumes an amount of memory that
grows with the number of procedure calls, even when the process described is, in principle, iterative. As a consequence, these languages can
describe iterative processes only by resorting to special-purpose “looping constructs” such as do, repeat, until, for, and while.
The implementation of Scheme we shall consider in Chapter 5 does not share this defect. 
It will execute an iterative process in constant space, even if the iterative process is described by a recursive procedure. An implementation
with this property is called tail-recursive. With a tail-recursive implementation, iteration can be expressed using the ordinary procedure
call mechanism, so that special iteration constructs are useful only as syntactic sugar.*
