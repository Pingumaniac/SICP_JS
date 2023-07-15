# Notes

Made notes of things that I have found interesting.

* delayed evaluation -> "enables us to represent very large (even infinite) sequences as streams (317)"
* "Stream processing lets us model systems that have state without ever using assignment or mutable data. (317)"
* "Unfortunately, if we represent sequences as lists, this elegance is bought at the price of severe inefficiency with respect to both the time and space required by our computations. When we represent manipulations on sequences as transformations of lists, our programs must construct and copy data structures (which may be huge) at every step of a process. (317)"
* "In many applications, we end up forcing the same delayed object many times. This can lead to serious inefficiency in recursive programs involving streams. (324)"
* "The solution is to build delayed objects so that the first time they are forced, they store the value that is computed. Subsequent forcings will simply return the stored value without repeating the computation. In other words, we implement delay as a special-purpose memoized procedure. (324)"

## Difference between list and streams

* list -> evaluated at construction time
* streams -> evaluated at selection time
