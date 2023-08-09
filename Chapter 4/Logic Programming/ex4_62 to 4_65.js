/*
ex 4.62

Evaluating outranked_by(list("Bitdiddle", "Ben"), $who) will cause
to eval outranked_by($middle_manager, $boss), this will eval
outranked_by($staff-person, $boss).

Infinite loop.

ex 4.63

This is because there are four middle managers whom Oliver Warbucks manages.

ex 4.64

Filtering to obtain unique elements should apply for the staff names, instead of the salary.

ex 4.65

Information to be included in this history:
1. Patterns: Store the pattern of each query, such as the specific symbols,
relationships, or variables used in the query.
2. Frames: Include contextual information or metadata about the query,
such as the deductive rules or any constraints being applied.

Check for Loops:
1. Before procesing a new query, compare its pattern and frame to the queries being procesed.
2. If they match, then a loop is occurring.

Update History:
1. Add new queries' patterns and framesto the history.
2. Remove completed queries' patterns and frames from the history.
*/
