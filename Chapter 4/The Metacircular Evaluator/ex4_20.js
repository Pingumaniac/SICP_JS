const { exec } = require('child_process');

// Parser helper functions
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
// end of parser helper functions

// Separating Syntactic Analysis from Execution
function evaluate(component, env) { return analyze(component)(env); }
function analyze(component) {
    if (is_literal(component)) {
        return analyze_literal(component);
    } else if (is_name(component)) {
        return analyze_name(component);
    } else if (is_application(component)) {
        return analyze_application(component);
    } else if (is_operator_combination(component)) {
        return analyze(operator_combination_to_application(component));
    } else if (is_conditional(component)) {
        return analyze_conditional(component);
    } else if (is_lambda_expression(component)) {
        return analyze_lambda_expression(component);
    } else if (is_sequence(component)) {
        return analyze_sequence(component);
    } else if (is_block(component)) {
        return analyze_block(component);
    } else if (is_return_statement(component)) {
        return analyze_return_statement(component);
    } else if (is_function_declaration(component)) {
        return analyze(function_decl_to_constant_decl(component));
    } else if (is_declaration(component)) {
        return analyze_declaration(component);
    } else if (is_assignment(component)) {
        return analyze_assignment(component);
    } else if (is_while_loop(component)) { // ex 4.20
        return analyze_while_loop(component);
    } else {
        throw new Error("Unknown expression type in analyze: " + component);
    }
}
function analyze_literal(component) { return env => literal_value(component); }
function analyze_name(component) { return env => lookup_symbol_value(symbol_of_name(component), env); }
function analyze_application(component) {
    const ffun = analyze(function_expression(component));
    const afuns = map(analyze, argument_expressions(component));
    return env => execute_application(ffun(env), map(afun => afun(env), afuns));
}
function execute_application(fun, args) {
    if (is_primitive_function(fun)) {
        return apply_primitive_function(fun, args);
    } else if (is_compound_function(fun)) {
        const result = function_body(fun)
        (extend_environment(function_parameters(fun), args, function_environment(fun)));
        return is_return_value(result) ? return_value_content(result) : undefined;
    } else {
        throw new Error("Unknown function type in apply: " + fun);
    }
}
function analyze_conditional(component) {
    const pfun = analyze(conditional_predicate(component));
    const cfun = analyze(conditional_consequent(component));
    const afun = analyze(conditional_alternative(component));
    return env => is_truthy(pfun(env)) ? cfun(env) : afun(env);
}
function analyze_lambda_expression(component) {
    const params = lambda_parameter_symbols(component);
    const bfun = analyze(function_body(component));
    return env => make_compound_function(params, bfun, env);
}
function analyze_sequence(stmts) {
    function sequentially(fun1, fun2) {
        return env => {
            const fun1_val = fun1(env);
            return is_return_value(fun1_val) ? fun1_val : fun2(env);
        };
    }
    function loop(first_fun, rest_funs) {
        return rest_funs === null ? first_fun : loop(sequentially(first_fun, rest_funs[0]), rest_funs[1]);
    }
    const funs = map(analze, stmts);
    return funs === null ? env => undefined : loop(funs[0], funs[1]);
}
function analyze_block(component) {
    const body = block_body(component);
    const bfuns = analyze(body);
    const locals = scan_out_declarations(body);
    const unassigneds = list_of_unassigneds(locals);
    return env => bfuns(extend_environment(locals, unassigneds, env));
}
function analyze_return_statement(component) {
    const rfun = analyze(return_expression(component));
    return env => make_return_value(rfun(env));
}
function analyze_assignment(component) {
    const symbol = assignment_symbol(component);
    const vfun = analyze(assignment_value_expression(component));
    return env => {
        const value = vfun(env);
        assign_symbol_value(symbol, value, env);
        return value;
    }
}
function analyze_declaration(component) {
    const symbol = declaration_symbol(component);
    const vfun = analyze(declaration_value_expression(component));
    return env => {
        assign_symbol_value(symbol, vfun(env), env);
        return undefined;
    }
}
// ex 4.20
function analyze_while_loop(component) {
    const pfun = analyze(get_while_loop_predicate(component));
    const bfun = analyze_sequence(get_while_loop_body(component));

    return env => {
        let result;
        while (is_truthy(pfun(env))) {
            result = bfun(env);
            if (is_return_value(result)) {
                return return_value_content(result);
            }
            if (is_break_value(result)) {
                break;
            }
        }
        return result;
    };
}

// Utility Function
function map(fun, list) {
    let result = [];
    for(let i = 0; i < list.length; i++) {
        result.push(fun(list[i]));
    }
    return result;
}

// Helper functions for while loop (ex 4.20)
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

// Other elper functions
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
function is_and(component) { return is_tagged_list(component, "and"); }
function is_or(component) { return is_tagged_list(component, "or"); }
function is_duplicate(list) { let set = new Set(list); return set.size !== list.length; }
function is_break(component) { return is_tagged_list(component, "break"); }
function make_break() { return ["break"]; }
function eval_break() { return ["break_value"]; }
function is_break_value(value) { return is_tagged_list(value, "break_value"); }
function is_continue(component) { return is_tagged_list(component, "continue"); }
function make_continue() {  return ["continue"]; }
function eval_continue() { return ["continue_value"]; }
function is_continue_value(value) { return is_tagged_list(value, "continue_value"); }

// Handling Environment and Variable Declarations
function is_truthy(x) { return is_falsy(x); }
function is_falsy(x) {
    return (is_boolean(x) && !x) || (is_number(x) && (x === 0 || x !== x)) ||
              (is_string(x) && x === "") || x === null || x === undefined;
}
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
         frame[symbols[i]] = {val: vals[i], is_const: false};
    }
    return [frame, base_env];
}
function lookup_symbol_value(symbol, env) {
    return environment_traversal(symbol, env, (frame, symbol) => {
        if(frame[symbol].val === "*unassigned*") {
            throw new Error("Trying to access a variable before its declaration is evaluated: " + symbol);
        } else {
            return frame[symbol].val;
        }
    });
}
function scan_out_declarations(component) {
    if (is_sequence(component)) {
        return accumulate(append, null, map(scan_out_declarations, sequence_statements(component)));
    } else if (is_declaration(component) || is_var_declaration(component)) {
        return [symbol_of_declaration(component)];
    } else {
        return null;
    }
}
function eval_block(component, env) {
    const body = block_body(component);
    const locals = scan_out_declarations(body);
    const unassigneds = list_of_unassigneds(locals);
    const block_env = extend_environment(locals, unassigneds, env);
    if (is_var_declaration(component)) {
        assign_symbol_value(symbol_of_declaration(component), evaluate(declaration_value(component), env), env);
    } else {
        evaluate(body, block_env);
    }
    const result = evaluate(body, block_env);
    return is_value_producing(body) ? result : undefined;
}
function assign_symbol_value(symbol, val, env) {
    environment_traversal(symbol, env, (frame, symbol) => {
        if (!frame.hasOwnProperty(symbol)) {
            frame[symbol] = { val: val, is_const: false }; // adds a new binding to the global env implicitly
        } else if (frame[symbol].val === "*unassigned*") {
            throw new Error(`Trying to assign a value to a variable before its declaration is evaluated: ${symbol}`);
        } else if (frame[symbol].is_const) {
            throw new Error(`Cannot assign to constant variable ${symbol}`);
        } else {
            frame[symbol].val = val;
        }
    });
}
function make_function(parameters, body, env) {
    const body_declarations = scan_out_declarations(body);
    for (let param of parameters) {
        if (body_declarations.includes(param)) {
            throw new Error(`The parameter name, ${param}, conflicts with a variable declared directly in the function body.`);
        }
    }
    const unassigneds = list_of_unassigneds(body_declarations);
    const function_environment = extend_environment(body_declarations, unassigneds, env);
    return ["compound function", parameters, body, function_environment];
}
function apply(fun, args) {
    if (is_primitive_function(fun)) {
        return apply_primitive_function(fun, args);
    } else if (is_compound_function(fun)) {
        const params = function_parameters(fun);
        if (is_duplicate(params)) {
            throw new Error("The function has duplicate parameters: " + fun);
        }
        const function_env = function_environment(fun);
        for(let i = 0; i < params.length; i++) {
            assign_symbol_value(params[i], args[i], function_env);
        }
        const result = evaluate(function_body(fun), function_env);
        return is_return_value(result) ? return_value_content(result) : undefined;
    } else {
        throw new Error("Unknown function type -- apply: " + fun);
    }
}
// end of handling environment and variable declarations

// handling primitive functions
const primitive_functions = [["+", (x, y) => x + y], ["-", (x, y) => x - y], ["*", (x, y) => x * y],
["/", (x, y) => x / y], ["===", (x, y) => x === y], ["!==", (x, y) => x !== y], ["<", (x, y) => x < y],
[">", (x, y) => x > y], ["<=", (x, y) => x <= y], [">=", (x, y) => x >= y], ["!", x => !x],
["&&", (x, y) => x && y], ["||", (x, y) => x || y], ["%", (x, y) => x % y]];
const primitive_function_symbols = map(f => f[0], primitive_functions);
const primitive_function_objects = map(f => ["primitive", f[1][0]], primitive_functions);
const primitive_constants = [["undefined", undefined], ["math_PI", Math.PI], ["math_E", Math.E]];
const primitive_constant_symbols = map(c => c[0], primitive_constants);
const primitive_constant_values = map(c => c[1], primitive_constants);
// end of handling primitive functions

// handling environment and variable declarations
function setup_environment() {
    return extend_environment([primitive_function_symbols, primitive_constant_symbols],
        [primitive_function_objects, primitive_constant_values], the_empty_environment);
}
function is_primitive_function(fun) { return is_tagged_list(fun, "primitive function"); }
function primitive_implementation(fun) { return fun[1][0]; }
function apply_primitive_function(fun, arglist) {
    return apply_in_underlying_javascript(primitive_implementation(fun), arglist);
}
function apply_in_underlying_javascript(prim, arglist) {
    const arg_vector = [];
    let i = 0;
    while (arglist !== null) {
        arg_vector[i] = arglist[0];
        i = i + 1;
        arglist = arglist[1];
    }
    return prim.apply(prim, arg_vector);
}

const input_prompt = "M-evaluate input: ";
const output_prompt = "M-evaluate value: ";
function driver_loop(env) {
    const input = user_read(input_prompt);
    if (input === null) {
        console.log("evaluator terminated");
    } else {
        const program = parse(input);
        const locals = scan_out_declarations(program);
        const unassigneds = list_of_unassigneds(locals);
        const program_env = extend_environment(locals, unassigneds, env);
        const output = evaluate(program, program_env);
        user_print(output_prompt, output);
        return driver_loop(program_env);
    }
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function user_read(prompt_string, callback) {
    rl.question(prompt_string, (answer) => {
        callback(answer);
    });
}

function user_print(string, value) {
    function prepare(object) {
        return is_compound_function(object) ? "< compound-function >" :
            is_primitive_function(object) ? "< primitive-function >" :
            is_pair(object) ? [prepare(object[0], prepare(object[1]))] :
            object;
    }
    console.log(string + " " + stringify(prepare(value)));
}
const the_global_environment = setup_environment();
