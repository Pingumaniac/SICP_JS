const readline = require('readline');

function amb(expressions) {
    for (const expression of expressions) {
        const value = ambeval(expression);
        if (!is_falsy(value)) {
            return value;
        }
    }
    return undefined;
}
function map(fun, list) {
    let result = [];
    for(let i = 0; i < list.length; i++) {
        result.push(fun(list[i]));
    }
    return result;
}
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
function is_truthy(x) { return is_falsy(x); }
function is_falsy(x) {
    return (is_boolean(x) && !x) || (is_number(x) && (x === 0 || x !== x)) ||
        (is_string(x) && x === "") || x === null || x === undefined;
}
const the_empty_environment = null;
function list_of_unassigneds(symbols) { return map(symbol => "*unassigned*", symbols); }
function is_declaration(component) {
    return is_tagged_list(component, "constant_declaration") ||
        is_tagged_list(component, "variable_declaration") ||
        is_tagged_list(component, "function_declaration");
}
function is_sequence(component) { return is_tagged_list(component, "sequence"); }
function sequence_statements(component) { return tail(component); }
function is_tagged_list(component, tag) { return is_pair(component) && head(component) === tag; }
function is_return_value(component) { return is_tagged_list(component, "return_value"); }
function is_var_declaration(component) { return is_tagged_list(component, "variable_declaration"); }
function scan_out_declarations(component) {
    if (is_sequence(component)) {
        return accumulate(append, null, map(scan_out_declarations, sequence_statements(component)));
    } else if (is_declaration(component) || is_var_declaration(component)) {
        return [symbol_of_declaration(component)];
    } else {
        return null;
    }
}

function require(p) { if (!p) { amb(); } else { } }
function an_integer_starting_from(n) { return amb(n, an_integer_starting_from(n + 1)); }
function an_integer_between(low, high) {
    require(low <= high);
    return amb(low, an_integer_between(low + 1, high));
}
function distinct(items) {
    return items === null ? true : items[1] === null ? true : member(items[0], items[1]) === null ?
        distinct(items[1]) : false;
}
function amb_eval(exp) {
    return is_delayed_thunk(exp) ? amb_eval(exp()) : is_amb_exp(exp) ? amb_eval(amb_value(exp)) : exp;
}
function is_delayed_thunk(exp) { return is_pair(exp) && head(exp) === "delayed"; }
function amb_value(exp) { return head(tail(exp)); }
function is_amb_exp(exp) { return is_pair(exp) && head(exp) === "amb"; }
function is_pair(x) { return Array.isArray(x) && x.length === 2; }
function head(x) { return x[0]; }
function tail(x) { return x.slice(1); }
function member(x, xs) { return xs === null ? null : x === head(xs) ? xs : member(x, tail(xs)); }
const nouns = ["noun", "student", "professor", "cat", "class"];
const verbs = ["verb", "studies", "lectures", "eats", "sleeps"];
const articles = ["article", "the", "a"];
const prepositions = ["prep", "for", "to", "in", "by", "with"];
const adjectives = ["adjective", "quick", "brown", "small"];
const adverbs = ["adverb", "quickly", "slowly"];
const conjunctions = ["and", "or", "but"];

let not_yet_parsed = null;

function parse_input(input) {
    not_yet_parsed = input;
    const sent = parse_sentence();
    require(not_yet_parsed === null);
    return sent;
}

function parse_sentence() { return ["sentence", parse_noun_phrase(), parse_verb_phrase()]; }
function parse_simple_noun_phrase() { return ["simple-noun-phrase", parse_word(articles), parse_word(nouns)]; }
function parse_adjective() { return parse_word(adjectives); }
function parse_adverb() { return parse_word(adverbs); }
function parse_conjunction() { return parse_word(conjunctions); }
function parse_prepositional_phrase() {
    if (not_yet_parsed && member(not_yet_parsed[0], prepositions.slice(1))) {
        const prep = parse_word(prepositions);
        const noun_phrase = parse_noun_phrase();
        return ["prep-phrase", prep, noun_phrase];
    } else {
        return null;
    }
}
function parse_noun_phrase() {
    const simple_noun_phrase = parse_simple_noun_phrase();
    const prep_phrase = parse_prepositional_phrase();
    return prep_phrase ? ["noun-phrase", simple_noun_phrase, prep_phrase] : simple_noun_phrase;
}
function parse_verb_phrase() {
    if (!not_yet_parsed) { return null; }
    const verb = parse_word(verbs);
    const adverb = member(not_yet_parsed[0], adverbs.slice(1)) ? parse_adverb() : null;
    const noun_phrase = parse_noun_phrase();
    if (adverb && noun_phrase) { return [adverb, verb, noun_phrase]; }
    if (adverb) { return [adverb, verb]; }
    if (noun_phrase) { return [verb, noun_phrase]; }
    return verb;
}
function an_element_of(items) {
    if (items.length === 0) { return null; }
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}
function generate_sentence() { return construct_sentence(parse_sentence()); }
function construct_sentence(sentence) {
    if (sentence === null) { return ''; }
    const [type, ...args] = sentence;
    if (type === "sentence") {
        return `${construct_sentence(args[0])} ${construct_sentence(args[1])}`;
    } else if (type === "noun-phrase") {
        return `${construct_noun_phrase(args[0])} ${construct_prepositional_phrase(args[2])}`;
    } else if (type === "verb-phrase") {
        return `${construct_verb_phrase(args)}`;
    } else if (type === "prep-phrase") {
        return `${construct_word(args[0])} ${construct_noun_phrase(args[2])}`;
    } else {
        return construct_word(args);
    }
}
function construct_noun_phrase(noun_phrase) {
    const [noun_type, ...args] = noun_phrase;
    if (noun_type === "simple-noun-phrase") {
        return `${construct_word(args[0])} ${construct_word(args[1])}`;
    } else if (noun_type === "noun-phrase") {
        return `${construct_noun_phrase(args[0])} ${construct_prepositional_phrase(args[2])}`;
    } else {
        return construct_word(args);
    }
}
function construct_verb_phrase(verb_phrase) {
    const [verb_type, ...args] = verb_phrase;
    if (verb_type === "verb") {
        return construct_word(args);
    } else if (verb_type === "adverb") {
        return `${construct_word(args[0])} ${construct_verb_phrase(args[1])}`;
    } else {
        return `${construct_word(args[0])} ${construct_noun_phrase(args[1])}`;
    }
}
function construct_prepositional_phrase(prep_phrase) {
    const [prep_type, ...args] = prep_phrase;
    return `${construct_word(args[0])} ${construct_noun_phrase(args[2])}`;
}
function construct_word(word) { return word; }

// implementing amb evaluator
function analyze(component) {
    if (is_literal(component)) {
        return analyze_literal(component);
    } else if (is_name(component)) {
        return analyze_name(component);
    } else if (is_application(component)) {
        apply(actual_value(function_expression(component), env), arg_expressions(component), env);
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
    } else if (is_while_loop(component)) {
        return analyze_while_loop(component);
    } else if (is_quoted(exp)) {
        return analyze_quoted_expression(quoted_text(exp));
    } else if (is_amb(component)) {
        return analyze_amb(component);
    } else {
        throw new Error("Unknown expression type in analyze: " + component);
    }
}
function is_amb(component) {
    return is_tagged_list(component, "appliation") && is_name(function_expression(component)) &&
        symbol_of_name(function_expression(component)) === "amb";
}
function ambeval(component, env, succeed, fail) { return analyze(component)(env, succeed, fail); }
function analyze_literal(component) {
    return (env, succeed, fail) => succeed(literal_value(component), fail);
}
function analyze_name(component) {
    return (env, succeed, fail) => succeed(lookup_symbol_value(symbol_of_name(component), env), fail);
}
function analyze_lambda_expression(component) {
    const params = lambda_parameter_symbols(component);
    const bfun = analyze(lambda_body(component));
    return (env, succeed, fail) => succeed(make_procedure(params, bfun, env), fail);
}
function analyze_conditional(component) {
    const pfun = analyze(conditional_predicate(component));
    const cfun = analyze(conditional_consequent(component));
    const afun = analyze(conditional_alternative(component));
    return (env, succeed, fail) => pfun(env, (pred_value, fail2) => is_truthy(pred_value) ?
        cfun(env, succeed, fail2) : afun(env, succeed, fail2), fail);
}
function analyze_sequence(stmts) {
    function sequentially(a, b) {
        return (env, succeed, fail) => (a_value, fail2) => is_return_value(a_value) ?
            succeed(a_value, fail2) : b(env, succeed, fail2);
    }
    function loop(first_fun, rest_funs) {
        return rest_funs === null ? first_fun : sequentially(first_fun, loop(head(rest_funs), tail(rest_funs)));
    }
    const funs = map(analyze, stmts);
    return funs === null ? env => undefined : loop(head(funs), tail(funs));
}
function analyze_declaration(component) {
    const symbol = declaration_symobl(component);
    const vfun = analyze(declaration_value_expression(component));
    return (env, succeed, fail) => vfun(env, (val, fail2) => {
        assign_symbol_value(symbol, val, env);
        return succeed(undefined, fail2);
    }, fail);
}
function analyze_assignment(component) {
    const symbol = assignment_symbol(component);
    const vfun = analyze(assignment_value_expression(component));
    return (env, succeed, fail) => vfun(env, (value, fail2) => {
        const old_value = lookup_symbol_value(symbol, env);
        assign_symbol_value(symbol, value, env);
        return succeed(val, () => {
            assign_symbol_value(symbol, old_value, env);
            return fail2();
        });
    }, fail);
}
function analyze_return_statement(component) {
    const rfun = analyze(return_expression(component));
    return (env, succeed, fail) => rfun(env, (val, fail2) => succeed(make_return_value(val), fail2), fail);
}
function analyze_block(component) {
    const body = block_body(component);
    const locals = scan_out_declarations(component);
    const unassigneds = list_of_unassigneds(locals);
    const bfun = analyze_sequence(body);
    return (env, succeed, fail) => bfun(extend_environment(locals, unassigneds, env), succeed, fail);
}
function analyze_application(component) {
    const ffun = analyze(function_expression(component));
    const afun = map(analyze, args_expressions(component));
    return (env, succeed, fail) => ffun(env, (fun, fail2) => {
        get_args(afuns, env, (args, fail3) => {
            execute_application(fun, args, succeed, fail3);
        }, fail2);
    }, fail);
}
function get_args(afuns, env, succeed, fail) {
    return afuns === null ? succeed(null, fail) : head(afuns)(env, (arg, fail2) => {
        get_args(tail(afuns), env, (args, fail3) => succeed([arg, args], fail3), fail2);
    }, fail);
}
function execute_application(fun, args, succeed, fail) {
    return is_primitive_function(fun) ? succeed(apply_primitive_function(fun, args), fail) :
        is_compound_function(fun) ? function_body(fun)(extend_environment(function_parameters(fun),
            args, function_environment(fun)), (body_result, fail2) => succeed(is_return_value(body_result)
                ? return_value_content(body_result) : undefined, fail2), fail) :
            error(fun, "Unknown function type -- apply");
}
function analyze_amb(component) {
    const cfuns = map(analyze, amb_choices(component));
    return (env, succeed, fail) => {
        function try_next(choices) {
            return choices == null ? fail : head(choices)(env, succeed, () => try_next(tail(choices)));
        }
        return try_next(cfuns);
    };
}

// ex 4.48
function ramb(expressions) {
    const shuffled_expression = shuffle_array([...expressions]);
    for (let expression of shuffled_expression) {
        const value = ambeval(expression);
        if (!is_falsy(value)) { return value; }
    }
    return undefined;
}
function shuffle_array(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
function analyze_ramb(component) {
    const cfuns = map(analyze, ramb_choices(component));
    const shuffled_cfuns = shuffle_array([...cfuns]);
    return (env, succeed, fail) => {
        function try_next(choices) {
            return choices == null ? fail : head(choices)(env, succeed, () => try_next(tail(choices)));
        }
        return try_next(shuffled_cfuns);
    };
}
// ramb can be used to generate random sentences
function generate_random_sentence() { return construct_sentence(parse_sentence()); }
function parse_word(word_list) { return [word_list[0], ramb(word_list.slice(1))]; }

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

/*
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function prompt_user(prompt_string) {
    return new Promise((resolve) => {
        rl.question(prompt_string, (answer) => {
            resolve(answer);
        });
    });
}
function user_print(string, value) {
    function prepare(object) {
        return is_lazy_pair(object) ? print_lazy_list(object, 7) :
            is_compound_function(object) ? "< compound-function >" :
                is_primitive_function(object) ? "< primitive-function >" :
                    is_pair(object) ? [prepare(object[0]), prepare(object[1])] :
                        object;
    }
    console.log(string + " " + stringify(prepare(value)));
}

const input_prompt = "amb-evaluate input:";
const output_prompt = "amb-evaluate value:";
function driver_loop(env) {
    async function internal_loop(retry) {
        const input = await prompt_user(input_prompt);
        if (input === null) {
            console.log("evaluator terminated");
        } else if (input === "retry") {
            return retry();
        } else {
            console.log("Starting a new problem");
            const program = parse(input);
            const locals = scan_out_declarations(program);
            const unassigneds = list_of_unassigneds(locals);
            const program_env = extend_environment(locals, unassigneds, env);
            return ambeval(program, program_env, (val, next_alternative) => {
                user_print(output_prompt, val);
                return internal_loop(next_alternative);
            },
                () => {
                    console.log("Thre are no more values of " + input);
                    return driver_loop(program_env);
                });
        }
    }
    return internal_loop(() => {
        console.log("There is no current problem.");
        return driver_loop(env);
    });
}

const the_global_environment = setup_environment();
driver_loop(the_global_environment);
*/
