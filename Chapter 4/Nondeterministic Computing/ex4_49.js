// ex 4.49
let count = 0;

function choose_two_distinct_elements() {
    let x = an_element_of("a", "b", "c");
    let y = an_element_of("a", "b", "c");
    require(x !== y);
    count = count + 1;
    return list(x, y, count);
}
/*
The values that would have been displayed if we had used the original meaning of assignment
rather than permanent assignment is

["a", ["b", [1, null]]]
["a", ["c", [1, null]]]
*/

function analyze_assignment(component) {
    if (is_permanent_assignment(component)) {
        return analyze_permanent_assignment(component);
    }
    const symbol = assignment_symbol(component);
    const vfun = analyze(assignment_value_expression(component));
    return (env, succeed, fail) => vfun(env, (value, fail2) => {
        const old_value = lookup_symbol_value(symbol, env);
        assign_symbol_value(symbol, value, env);
        return succeed(value, () => {
            assign_symbol_value(symbol, old_value, env);
            return fail2();
        });
    }, fail);
}
function is_permanent_assignment(expr) { return is_tagged_list(expr, "pernamenant_assignment"); }
function analyze_permanent_assignment(expr) {
    const variable = assignment_variable(expr);
    const vproc = analyze(assignment_value(expr));
    return (env, succeed, fail) => vproc(env, (val, fail2) => {
        set_variable_value(variable, val, env);
        succeed('ok', fail2);
    }, fail);
}
