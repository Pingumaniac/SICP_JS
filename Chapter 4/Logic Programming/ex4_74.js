/*
1. create a data structure to hold promises.
Include the predicate to be applied and its corresponding variables that must be bound.
2. change the frame structure: e.g. introduce promises and keeps all of the promises that
should to be fulfilled for that frame.
3. change the way to add promises: e.g. when a filtering operation is to be applied
(e.g. not or javascript_predicate), check if the variables are bound,
then apply the filtering operation, else add a promise to the frame in delayed manner.
4. fulfilling promises: e.g. if a variable is bound in a frame,
check all the promises to see if they can now be fulfilled.
If a promise can be fulfilled, then perform filtering ASAP.
*/
