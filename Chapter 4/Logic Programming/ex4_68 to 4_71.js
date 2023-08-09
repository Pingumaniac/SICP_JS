// ex4.68
function simple_query(query_pattern, frame_stream) {
    return stream_flatmap(frame =>
        stream_append(find_assertions(query_pattern, frame), apply_rules(query_pattern, frame)),
        frame_stream);
}
function disjoin(disjuncts, frame_stream) {
    return is_empty_disjunction(disjuncts) ? null :
        interleave(evaluate_query(first_disjunct(disjuncts), frame_stream),
        disjoin(rest_disjuncts(disjuncts), frame_stream));
}
/*
Changing simple_query and disjoin in this way (not using delayed expressions) can cause, for example,
infinite loop in "or queries". By contrast, using delayed expressions, we can avoid the infinite
loop of evaluating or queries and return values as it is evaluated.

Thus, this can cause unnecessary computation in simple queries. Using delayed evaluation
ensures that apply_rules is only called if necessary.

ex 4.69

e.g. if there is a stream for even numbers and odd numbers and try to combine them in
ascending order using append, this will cause infinite loop. However, if we use delayed
evaluation (interleave),  we can avoid this infinite loop and return

0, 1, 2, 3, 4, 5...

ex 4.70
*/
function flatten_stream(stream) {
    return stream === null ? null : interleave(head(stream), () => flatten_stream(stream_tail(stream)));
}
/*
Using interleave instead of interleave_delayed will cause infinite loop. For example, i
if the stream that is inputted has a nested infinite structure, then the interleave will call
flatten_stream to fully evaluate the stream. However, if we use interleave_delayed, then
we can avoid this infinite loop and return the stream as it is evaluated.

ex 4.71 Part a
*/
function simple_stream_flatmap(fun, s) { return simple_flatten(stream_map(fun, s)); }
function simple_flatten(stream) {
    return stream_map(x => head(x), stream_filter(x => !is_null(x), stream));
}
// ex 4.71 Part b: The behavior of the system does not change, but makes it more efficient
// by preventing interleave operations.
