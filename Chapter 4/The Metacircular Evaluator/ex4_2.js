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
    if (is_truthy(evaluate(conditional_predicate(component, env)))) {
        return evaluate(conditional_consequent(component, env));
    } else {
        return evaluate(conditional_alternative(component, env));
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

// function for parsing
function is_literal(component) { return is_tagged_list(component, "literal"); }
function is_tagged_list(component, the_tag) { return is_pair(component) && component[0] === the_tag; }
function is_pair(x) { return x instanceof Array && x.length === 2; }
function make_literal(value) { return ["literal", value]; }
function make_name(symbol) { return ["name", symbol]; }
function make_application(function_expression, argument_expressions) {
    return ["application", function_expression].concat(argument_expressions);
}
function lambda_parameter_symbols(component) { return map(symbol_of_name, component[1][0]); }
function make_lambda_expression(parameter_symbols, body) { return ["lambda", parameter_symbols, body]; }
function first_statement(stmts) { return stmts[0]; }
function rest_statements(stmts) { return stmts[1]; }
function is_empty_sequence(stmts) { return stmts === null; }
function is_last_statment(stmts) { return stmts[1] === null; }
function assignment_symbol(component) { return symbol_of_name(component[1][0]); }
function declaration_symbol(component) { return symbol_of_name(component[1][0]); }
function declaration_value_expression(component) { return component[1][1][0]; }
function make_constant_declaration(name, value_expression) {
    return ["constant_declaration", name, value_expression];
}
function is_declaration(component) {
    return is_tagged_list(component, "constant_declaration") ||
              is_tagged_list(component, "variable_declaration") ||
                is_tagged_list(component, "function_declaration");
}
function function_decl_to_constant_decl(component) {
    return make_constant_declaration(function_declaration_name(component),
                                     make_lambda_expression(function_declaration_parameters(component),
                                                            function_declaration_body(component)));
}
function operator_combination_to_application(component) {
    const operator = operator_symbol(component);
    return is_unary_operator_combination(component) ?
              make_application(make_name(operator), [first_operand(component)]) :
                make_application(make_name(operator), [first_operand(component), second_operand(component)]);
}

// ex 4.2
function unparse(component) {
    if (is_literal(component)) {
        return "This is a literal: " + stringify(literal_value(component)) + "\n";
    } else if (is_name(component)) {
        return "This is a name: " + stringify(symbol_of_name(component)) + "\n";
    } else if (is_application(component)) {
        return "This is an application: " + stringify(operator_symbol(component)) + " " + stringify(operands(component)) + "\n";
    } else if (is_lambda_expression(component)) {
        return "This is a lambda expression: " + stringify(lambda_parameter_symbols(component)) + " " + stringify(lambda_body(component)) + "\n";
    } else if (is_conditional(component)) {
        return "This is a conditional: " + stringify(conditional_predicate(component)) + " " + stringify(conditional_consequent(component)) + " " + stringify(conditional_alternative(component)) + "\n";
    } else if (is_sequence(component)) {
        return "This is a sequence: " + stringify(sequence_statements(component)) + "\n";
    } else if (is_block(component)) {
        return "This is a block: " + stringify(block_body(component)) + "\n";
    } else if (is_return_statement(component)) {
        return "This is a return statement: " + stringify(return_expression(component)) + "\n";
    } else if (is_function_declaration(component)) {
        return "This is a function declaration: " + stringify(function_declaration_name(component)) + " " + stringify(function_declaration_parameters(component)) + " " + stringify(function_declaration_body(component)) + "\n";
    } else if (is_declaration(component)) {
        return "This is a declaration: " + stringify(declaration_symbol(component)) + " " + stringify(declaration_value_expression(component)) + "\n";
    } else if (is_assignment(component)) {
        return "This is an assignment: " + stringify(assignment_symbol(component)) + " " + stringify(assignment_value_expression(component)) + "\n";
    } else {
        throw new Error("Unknown syntax -- unparse: " + component);
    }
}
