function evaluate(component, env) {
    if (is_literal(component)) {
        return literal_value(component);
    } else if (is_name(component)) {
        return lookup_symbol_value(symbol_of_name(component), env);
    } else if (is_application(component)) {
        return apply(evaluate(function_expression(component), env),
                     list_of_values(function_arguments(component), env));
    } else if (is_operator_combination(component)) {
        return evaluate(operator_combination_to_application(component), env);
    } else if (is_conditional(component)) {
        return evaluate_conditional(component, env);
    } else if (is_lambda_expression(component)) {
        return make_function(lambda_parameter_symbols(component), lambda_body(component), env);
    } else if (is_sequence(component)) {
        return eval_sequence(sequence_statements(component), env);
    } else if (is_block(component)) {
        return eval_block(component, env);
    } else if (is_return_statement(component)) {
        return eval_return_statement(component, env);
    } else if (is_function_declaration(component)) {
        return evaluate(function_decl_to_constant_decl(component), env);
    } else if (is_declaration(component)) {
        return eval_declaration(component, env);
    } else if (is_assignment(component)) {
        return eval_assignment(component, env);
    } else {
        throw new Error("Unknown syntax -- evaluate: " + component);
    }
}
function apply(fun, args) {
    if (is_primitive_function(fun)) {
        return apply_primitive_function(fun, args);
    } else if (is_compound_function(fun)) {
        const result = evaluate(function_body(fun),
        extend_environment(function_parameters(fun), args, function_environment(fun)));
        return is_return_value(result) ? return_value_content(result) : undefined;
    } else {
        throw new Error("Unknown function type -- apply: " + fun);
    }
}
function list_of_values(exps, env) { return map(arg => evaluate(arg, env), exps); }
function eval_conditional(component, env) {
    if (is_truthy(evaluated_conditional_predicate(component, env))) {
        return evaluate_conditional_consequent(component, env);
    } else {
        return evaluate_conditional_alternative(component, env);
    }
}
function eval_sequence(stmts, env) {
    if (is_empty_sequence(stmts)) {
        return undefined;
    } else if (is_last_statment(stmts)) {
        return evaluate(first_statement(stmts), env);
    } else {
        const first_stmt_value = evaluate(first_statement(stmts), env);
        if (is_return_value(first_stmt_value)) {
            return first_stmt_value;
        } else {
            return eval_sequence(rest_statements(stmts), env);
        }
    }
}
function eval_block(component, env) {
    const body = block_body(component);
    const locals = scan_out_declarations(body);
    const unassigneds = list_of_unassigneds(locals);
    return evaluate(body, extend_environment(locals, unassigneds, env));
}
function list_of_unassigneds(symbols) { return map(symbol => "*unassigned*", symbols); }
function scan_out_declarations(component) {
    if (is_sequence(component)) {
        return accumulate(append, null, map(scan_out_declarations, sequence_statements(component)));
    } else if (is_declaration(component)) {
        return [symbol_of_declaration(component)];
    } else {
        return null;
    }
}
function eval_return_statement(component, env) {
    return make_return_value(evaluate(return_expression(component), env));
}
function eval_assignment(component, env) {
    const value = evaluate(assignment_value_expression(component), env);
    assign_symbol_value(assignment_symbol(component), value, env);
    return value;
}
function eval_declaration(component, env) {
    assign_symbol_value(declaration_symbol(component), evaluate(declaration_value_expression(component), env), env);
    return undefined;
}

// ex 4.1
function list_of_values_left_to_right(exps, env) {
    return exps === [] ? [] : exps.length === 1 ? [evaluate(exps[0], env)]
            : [evaluate(exps[0], env), list_of_values_left_to_right(exps[1], env)];
}
function list_of_values_right_to_left(exps, env) {
    return exps === [] ? [] : exps.length === 1 ? [evaluate(exps[0], env)]
            : [evaluate(exps[1][0], env), list_of_values_right_to_left([exps[0], exps[1][1]], env)];
}
// end of ex 4.1
