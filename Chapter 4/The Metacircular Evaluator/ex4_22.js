/*
Although I do not have time to design and carry out some experiements to compare the spped of
the original metacircular evaluator with the version in this section, the latter should be
faster.

This is because for the original evaluator,if a program is executed many times, its syntax is
analyzed many times. In contrast, the evaluator in this section perform syntactic analysis only
once.
*/
