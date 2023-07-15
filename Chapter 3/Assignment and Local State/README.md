# Notes

Made notes of things that I have found interesting.

"One powerful design strategy, which is particularly appropriate to
the construction of programs for modeling physical systems, is to base
the structure of our programs on the structure of the system being modeled.
For each object in the system, we construct a corresponding computational
object. For each system action, we define a symbolic operation
in our computational model. Our hope in using this strategy is that
extending the model to accommodate new objects or new actions will
require no strategic changes to the program, only the addition of the
new symbolic analogs of those objects or actions. If we have been successful
in our system organization, then to add a new feature or debug
an old one we will have to work on only a localized part of the system.

To a large extent, then, the way we organize a large program is dictated
by our perception of the system to be modeled. In this chapter we
will investigate two prominent organizational strategies arising from
two rather different “world views” of the structure of systems. The first
organizational strategy concentrates on objects, viewing a large system
as a collection of distinct objects whose behaviors may change over
time. An alternative organizational strategy concentrates on the streams
of information that flow in the system, much as an electrical engineer
views a signal-processing system.

Both the object-based approach and the stream-processing approach
raise significant linguistic issues in programming. With objects, we must
be concerned with how a computational object can change and yet maintain
its identity. This will force us to abandon our old substitution model
of computation (Section 1.1.5) in favor of a more mechanistic but less
theoretically tractable environment model of computation. The difficulties
of dealing with objects, change, and identity are a fundamental consequence of the need to grapple with time in our computational models.
These difficulties become even greater when we allow the possibility of
concurrent execution of programs. The stream approach can be most
fully exploited when we decouple simulated time in our model from the
order of the events that take place in the computer during evaluation.
We will accomplish this using a technique known as delayed evaluation. (217-218)"

"From the point of view of one part of a complex process, the other
parts appear to change with time. They have hidden time-varying local
state. If we wish to write computer programs whose structure reflects
this decomposition, we make computational objects (such as bank accounts
and random-number generators) whose behavior changes with
time. We model state with local state variables, and we model the changes
of state with assignments to those variables. (228)"

"substitution is based ultimately on the notion
that the symbols in our language are essentially names for values.
But as soon as we introduce set! and the idea that the value of a variable
can change, a variable can no longer be simply a name. Now a
variable somehow refers to a place where a value can be stored, and the
value stored at this place can change. (231)"

Referential transparency = "A language that supports the concept that “equals can be substituted
for equals” in an expression without changing the value of the expression
is said to be referentially transparent. (232-233)"

"Referential transparency is violated when we include set! in our computer language. This makes
it tricky to determine when we can simplify expressions by substituting
equivalent expressions. Consequently, reasoning about programs that
use assignment becomes drastically more difficult. (233)"

Imperative programming = "programming that makes extensive use of assignment (234)"

"In addition to raising complications about computational models, programs
written in imperative style are susceptible to bugs that cannot occur in
functional programs. (234)"

"In general, programming with assignment forces us to carefully consider the relative orders
of the assignments to make sure that each statement is using the correct version of the variables that have been changed. This issue simply does
not arise in functional programs. (235)"

"The complexity of imperative programs becomes even worse if we
consider applications in which several processes execute concurrently.
We will return to this in Section 3.4. First, however, we will address the
issue of providing a computational model for expressions that involve
assignment, and explore the uses of objects with local state in designing
simulations. (235)" 
