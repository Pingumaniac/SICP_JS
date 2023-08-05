/*
Example: We can build a B+ tree where all values in the leaf nodes are all lazy-evaluated thunks.

Advanatage of this extra laziness: Guess this would be a good way to approach parallel programming
in a functional language. We can build a tree of thunks, and then evaluate them in parallel.
DBMS can use this to evaluate queries in parallel to process big data.
*/
