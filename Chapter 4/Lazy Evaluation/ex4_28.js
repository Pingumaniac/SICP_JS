// Cy's proposal
function eval_sequence(stmts, env) {
    if (stmts === null) {
        return undefined;
    } else if (is_last_statemet(stmts)) {
        return actual_value(first_statement(stmts), env);
    } else {
        const first_stmt_value = actual_value(first_statement(stmts), env);
        if (is_return_value(first_stmt_value)) {
            return first_stmt_value;
        } else {
            return eval_sequence(rest_statements(stmts), env);
        }
    }
}


// ex 4.28 Part (a)
function for_each (fun, items) {
    if (items === null) {
        return "done";
    } else {
        fun(first(items));
        return for_each(fun, rest(items));
    }
}

/*
The original eval_sequence ehandles for_each correctly

L-evaluate input:
for_each(display, list(57, 321, 88));

57
321
88

L-evaluate value:
"done"
Ben is right about the behavior of for_each

Every expression in the else clause will be evaluated using eval_sequence.
Thus, display is primitive function, and will get values in the list and display them.
*/

// Part (b)
function f1(x) {
    x = [x, [2]];
    return x;
}
function f2(x) {
    function f(e) {
        e;
        return x;
    }
    return f(x = [x, [2]]);
}

console.log(f1(1)); // Original eval sequence and Cy's proposal: [ 1, [ 2 ] ]
console.log(f2(1)); // Original eval sequence: returns thunk, Cy's proposal: [ 1, [ 2 ] ]

/*
Part (c):
Changing eval_sequence as from evaluate to actual_value does not affect the behavior of
the example in part a, because it is just changing when the value is evaluated.

Part (d):
I prefer Cy's approach over the original approach.
*/
