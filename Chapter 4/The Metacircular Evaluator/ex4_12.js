function list_of_values(exps, env) { return map(arg => evaluate(arg, env), exps); }
function eval_conditional(component, env) {
    if (is_truthy(evaluate(conditional_predicate(component, env)))) {
        return evaluate(conditional_consequent(component, env));
    } else {
        return evaluate(conditional_alternative(component, env));
    }
}
function list_of_unassigneds(symbols) { return map(symbol => "*unassigned*", symbols); }
function eval_return_statement(component, env) {
    return make_return_value(evaluate(return_expression(component), env));
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

function eval_and(component, env) {
    const result = evaluate(component[1][0], env);
    if (is_truthy(result)) {
        return evaluate(component[1][1], env);
    } else {
        return false;
    }
}
function eval_or(component, env) {
    const result = evaluate(component[1][0], env);
    if (is_truthy(result)) {
        return result;
    } else {
        return evaluate(component[1][1], env);
    }
}
function is_and(component) { return is_tagged_list(component, "and"); }
function is_or(component) { return is_tagged_list(component, "or"); }

function is_duplicate(list) { let set = new Set(list); return set.size !== list.length; }
function scan_out_declarations(component) {
    if (is_sequence(component)) {
        return accumulate(append, null, map(scan_out_declarations, sequence_statements(component)));
    } else if (is_declaration(component)) {
        return [symbol_of_declaration(component)];
    } else {
        return null;
    }
}

function is_while_loop(component) { return is_tagged_list(component, "while loop"); }
function get_while_loop_predicate(component) {
    if (!is_while_loop(component)) {
        throw new Error("Not a while loop");
    }
    return component[1];
}
function get_while_loop_body(component) {
    if (!is_while_loop(component)) {
        throw new Error("Not a while loop");
    }
    return component[2];
}
function while_loop(predicate, body) { while (predicate()) { body(); } }
function is_break(component) { return is_tagged_list(component, "break"); }
function make_break() { return ["break"]; }
function eval_break() { return ["break_value"]; }
function is_break_value(value) { return is_tagged_list(value, "break_value"); }
function is_continue(component) { return is_tagged_list(component, "continue"); }
function make_continue() {  return ["continue"]; }
function eval_continue() { return ["continue_value"]; }
function is_continue_value(value) { return is_tagged_list(value, "continue_value"); }

function eval_while(component, env) {
    while (is_truthy(evaluate(getWhileLoopPredicate(component), env))) {
        const result = evaluate(getWhileLoopBody(component), env);
        if (is_return_value(result)) {
            return result;
        } else if (is_break_value(result)) {
            break;
        } else if (is_continue_value(result)) {
            continue;
        }
    }
    return undefined;
}

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
    } else if (is_while_loop(component)) {
        return eval_while(component, env);
    } else if (is_break(component)) {
        return eval_break();
    }
    else if (is_continue(component)) {
        return eval_continue();
    } else {
        throw new Error("Unknown syntax -- evaluate: " + component);
    }
}
function eval_expression_statement(component, env) {
    return evaluate(expression_statement_expression(component), env);
}
function eval_sequence(stmts, env) {
    if (is_empty_sequence(stmts)) {
        return undefined;
    } else {
        const first_stmt_value = evaluate(first_statement(stmts), env);
        if (is_return_value(first_stmt_value)) {
            return first_stmt_value;
        } else if (is_last_statment(stmts)) {
            return is_value_producing(first_statement(stmts)) ? first_stmt_value : undefined;
        } else {
            return eval_sequence(rest_statements(stmts), env);
        }
    }
}
function eval_assignment(component, env) {
    const value = evaluate(assignment_value_expression(component), env);
    assign_symbol_value(assignment_symbol(component), value, env);
    return undefined;
}
function eval_block(component, env) {
    const body = block_body(component);
    const locals = scan_out_declarations(body);
    const unassigneds = list_of_unassigneds(locals);
    const block_env = extend_environment(locals, unassigneds, env);
    const result = evaluate(body, block_env);
    return is_value_producing(body) ? result : undefined;
}
function conditional_consequent(component) { return component[2]; }
function conditional_alternative(component) { return component[3]; }
function is_value_producing(component) {
    return is_expression_statement(component) ||
           (is_sequence(component) && any(is_value_producing, sequence_statements(component))) ||
           (is_conditional(component) && (is_value_producing(conditional_consequent(component)) ||
           is_value_producing(conditional_alternative(component))));
}

// Used is_truthy and is_falsy shown in Footnote 14 of SICP JS Section 4.1.3
function is_truthy(x) { return is_falsy(x); }
function is_falsy(x) {
    return (is_boolean(x) && !x) || (is_number(x) && (x === 0 || x !== x)) ||
              (is_string(x) && x === "") || x === null || x === undefined;
}
function make_function(parameters, body, env) { return ["compound function", parameters, body, env]; }
function is_compound_function(f) { return is_tagged_list(f, "compound function"); }
function function_parameters(f) { return f[1]; }
function function_body(f) { return f[2]; }
function function_environment(f) { return f[3]; }
function make_return_value(content) { return ["return_value", content]; }
function is_return_value(value) { return is_tagged_list(value, "return_value"); }
function return_value_content(value) { return value[1][0]; }
function encloisng_environment(env) { return env[1]; }
function first_frame(env) { return env[0]; }
const the_empty_environment = null;
function make_frame(symbol, values) { return [symbols, values] }
function frame_symbols(frame) { return frame[0]; }
function frame_values(frame) { return frame[1]; }

function enclosing_environment(env) { return env[1]; }
function first_frame(env) { return env[0]; }
function define_variable(symbol, val, env) {
    const frame = first_frame(env);
    if (symbol in frame) {
        frame[symbol] = val;
    } else {
        frame[symbol] = val;
    }
}
function environment_traversal(symbol, env, action) {
    if (env === null) { throw new Error("Unbound symbol: " + symbol); }
    const frame = first_frame(env);
    return symbol in frame ? action(frame, symbol) : environment_traversal(symbol, enclosing_environment(env), action);
}

function is_variable_declaration(component) { return is_tagged_list(component, "variable_declaration"); }
function is_constant_declaration(component) { return is_tagged_list(component, "constant_declaration"); }
function extend_environment(symbols, vals, base_env, is_const_array) {
    if (symbols.length !== vals.length) {
        throw new Error("Number of symbols does not match number of values");
    }
    let frame = {};
    for(let i = 0; i < symbols.length; i++) {
         frame[symbols[i]] = {val: vals[i], is_const: is_const_array[i]};
    }
    return [frame, base_env];
}
function eval_declaration(component, env) {
    if (is_constant_declaration(component)) {
        assign_constant_value(declaration_symbol(component), evaluate(declaration_value_expression(component), env), env);
    } else {
        assign_symbol_value(declaration_symbol(component), evaluate(declaration_value_expression(component), env), env);
    }
    return undefined;
}
function apply(fun, args) {
    if (is_primitive_function(fun)) {
        return apply_primitive_function(fun, args);
    } else if (is_compound_function(fun)) {
        const params = function_parameters(fun);
        if (is_duplicate(params)) {
            throw new Error("The function has duplicate parameters: " + fun);
        }
        const body_declarations = scan_out_declarations(function_body(fun));
        for (let param of params) {
            if (body_declarations.includes(param)) {
                throw new Error(`The parameter name, ${param}, conflicts with a variable declared directly in the function body.`);
            }
        }
        const result = evaluate(function_body(fun),
            extend_environment(function_parameters(fun), args, function_environment(fun), function_parameters(fun).map(() => false)));
        return is_return_value(result) ? return_value_content(result) : undefined;
    } else {
        throw new Error("Unknown function type -- apply: " + fun);
    }
}

// ex 4.12
function lookup_symbol_value(symbol, env) {
    return environment_traversal(symbol, env, (frame, symbol) => {
        if(frame[symbol].val === "*unassigned*") {
            throw new Error("Trying to access a variable before its declaration is evaluated: " + symbol);
        } else {
            return frame[symbol].val;
        }
    });
}
function assign_symbol_value(symbol, val, env) {
    environment_traversal(symbol, env, (frame, symbol) => {
        if (frame[symbol].val === "*unassigned*") {
            throw new Error(`Trying to assign a value to a variable before its declaration is evaluated: ${symbol}`);
        } else if (frame[symbol].is_const) {
            throw new Error(`Cannot assign to constant variable ${symbol}`);
        } else {
            frame[symbol].val = val;
        }
    });
}
