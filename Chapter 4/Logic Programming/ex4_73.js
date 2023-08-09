const readline = require('readline');

// stream operations
function stream_append_delayed(s1, delayed_s2) {
    return s1 === null ? delayed_s2() : pair(head(s1), () => stream_append_delayed(stream_tail(s1), delayed_s2));
}
function interleave_delayed(s1, delayed_s2) {
    return s1 === null ? delayed_s2() : pair(head(s1), () => interleave_delayed(delayed_s2(), stream_tail(s1)));
}
function stream_flatmap(fun, s) { return flatten_stream(stream_map(fun, s)); }
function flatten_stream(stream) {
    return stream === null ? null : interleave_delayed(head(stream), () => flatten_stream(stream_tail(stream)));
}
function singleton_stream(x) { return pair(x, () => null); }
function simple_stream_flatmap(fun, s) { return simple_flatten(stream_map(fun, s)); }
function simple_flatten(stream) {
    return stream_map(x => head(x), stream_filter(x => !is_null(x), stream));
}

// handling pattern variables
function is_variable(x) { return is_name(exp) && char_at(symbol_of_name(exp), 0) === "$"; }
let rule_counter = 0;
function new_rule_application_id() { rule_counter = rule_counter + 1; return rule_counter; }
function make_new_variable(variable, rule_application_id) {
    return make_name(symbol_of_name(variable) + "_" + rule_application_id);
}

function convert_to_query_syntax(exp) {
    if (is_application(exp)) {
        const function_symbol = symbol_of_name(function_expression(exp));
        if (function_symbol === "javascript_predicate") {
            return pair(function_symbol, arg_expresions(exp));
        } else {
            const processed_args = map(convert_to_query_syntax, arg_expressions(exp));
            return function_symbol === "pair" ? pair(head(processed_args), head(tail(processed_args)))
                : function_symbol === "list" ? processed_args : pair(function_symbol, processed_args);
        }
    } else if (is_variable(exp)) {
        return exp;
    } else {
        return literal_value(exp);
    }
}

// instatntiating an expression
function instantiate_expression(expression, frame) {
    return is_variable(expression) ? convert_to_query_syntax(instantiate_term(expression, frame)) :
        is_pair(expression) ? pair(instantiate_expression(head(expression), frame),
            instantiate_expression(tail(expression), frame)) : expression;
}
function instantiate_term(term, frame) {
    if (is_variable(term)) {
        const binding = binding_in_frame(term, frame);
        return binding === undefined ? term : instantiate_term(binding_value(binding), frame);
    } else if (is_pair(term)) {
        return pair(instantiate_term(head(term), frame), instantiate_term(tail(term), frame));
    } else {
        return term;
    }
}
function convert(term) {
    return is_variable(term) ? term : is_pair(term) ? make_application(make_name("pair"),
        list(convert(head(term)), convert(tail(term)))) : make_literal(term);
}

// predicates and selectors for the query-language-specific representation
function type(exp) {
    if (is_pair(exp)) {
        head(exp)
    } else {
        throw new Error("unknown expression type -- " + exp);
    }
}
function contents(exp) {
    if (is_pair(exp)) {
        tail(exp);
    } else {
        throw new Error("unknown expression contents -- " + exp);
    }
}
function is_assertion(exp) { return type(exp) === "assertion"; }
function assertion_body(exp) { return head(contents(exp)); }
function is_empty_conjunction(exp) { return exps === null; }
function first_conjunct(exp) { return head(exps); }
function rest_conjuncts(exp) { return tail(exps); }
function is_empty_disjunction(exp) { return exps === null; }
function first_disjunct(exp) { return head(exps); }
function rest_disjuncts(exp) { return tail(exps); }
function negated_query(exp) { return head(exp); }
function javascript_predicate_expression(exp) { return head(exp); }
function is_rule(exp) { return is_tagged_list(assertion, "rule"); }
function conclusion(exp) { return head(tail(exp)); }
function rule_body(rule) {
    return tail(tail(rule)) === null ? list("always_true") : head(tail(tail(rule)));
}

// frames and bindings
function make_binding(variable, value) { return pair(variable, value); }
function binding_variable(binding) { return head(binding); }
function binding_value(binding) { return tail(binding); }
function binding_in_frame(variable, frame) { return assoc(variable, frame); }
function extend(variable, value, frame) { return pair(make_binding(variable, value), frame); }

function evaluate_query(query, frame_stream) {
    const qfun = get(type(query), "evaluate_query");
    return qfun === undefined ? simple_query(query, frame_stream) : qfun(contents(query), frame_stream);
}

// simple query
function simple_query(query_pattern, frame_stream) {
    return stream_flatmap(frame =>
        stream_append_delayed(
            find_assertions(query_pattern, frame),
            () => apply_rules(query_pattern, frame)),
        frame_stream);
}

// compound queries

// ex 4.73
function check_compatibility(frame1, frame2) {
    for (const variable in frame1) {
        if (frame2.hasOwnProperty(variable) && frame1[variable] !== frame2[variable]) {
            return false;
        }
    }
    return true;
}
function merge_frames(frame1, frame2) {
    const new_frame = { ...frame1 };
    for (const variable in frame2) { new_frame[variable] = frame2[variable]; }
    return new_frame;
}
function conjoin(conjuncts, frame_stream) {
    if (is_empty_conjunction(conjuncts)) {
        return frame_stream;
    }
    const first_stream = evaluate_query(first_conjunct(conjuncts), frame_stream);
    const rest_conjuncts_stream = conjoin(rest_conjuncts(conjuncts), frame_stream);
    return stream_flatmap(frame1 =>
        stream_flatmap(frame2 =>
            check_compatibility(frame1, frame2) ? make_stream(merge_frames(frame1, frame2)) : null,
            rest_conjuncts_stream
        ),
        first_stream
    );
}
put("and", "evaluate_query", conjoin);
// end of ex 4.73

function disjoin(disjuncts, frame_stream) {
    return is_empty_disjunction(disjuncts) ? null :
        interleave_delayed(
            evaluate_query(first_disjunct(disjuncts), frame_stream),
            () => disjoin(rest_disjuncts(disjuncts), frame_stream));
}
put("or", "evaluate_query", disjoin);

function uniquely_asserted(queries, frame_stream) {
    return stream_flatmap(frame => {
        const stream_of_extensions = evaluate_query(tail(queries), list(frame));
        return stream_length(stream_of_extensions) === 1 ? stream_of_extensions : null;
    }, frame_stream);
}
put("unique", "evaluate_query", uniquely_asserted);
// unique(supervises($person, $subordinate))

// filters
function negate(exps, frame_stream) {
    return stream_flatmap(frame =>
        evaluate_query(exps, singleton_stream(frame)) === null ? singleton_stream(frame) : null,
        frame_stream);
}
put("not", "evaluate_query", negate);

function javascript_predicate(exps, frame_stream) {
    return stream_flatmap(frame =>
        evaluate_query(instantiate_expression(javascript_predicate_expression(exps), frame),
            the_global_environment) ? singleton_stream(frame) : null, frame_stream);
}
put("javascript_predicate", "evaluate_query", javascript_predicate);

function always_true(ignore, frame_stream) { return frame_stream; }
put("always_true", "evaluate_query", always_true);

function find_assertions(pattern, frame) {
    return stream_map(
        datum => check_an_assertion(datum, pattern, frame),
        fetch_assertions(pattern, frame));
}
function check_an_assertion(datum, pattern, frame) {
    const match_result = match(pattern, datum, frame);
    return match_result === "failed" ? null : singleton_stream(match_result);
}
function pattern_match(pattern, data, frame) {
    return frame === "failed" ? "failed" : equal(pattern, data) ? frame : is_variable(pattern) ?
        extend_if_consistent(pattern, data, frame) : is_pair(pattern) && is_pair(data) ?
            pattern_match(tail(pattern), tail(data), pattern_match(head(pattern), head(data), frame)) :
            "failed";
}
function extend_if_consistent(variable, data, frame) {
    const binding = binding_in_frame(variable, frame);
    return binding === undefined ? extend(variable, data, frame) :
        pattern_match(binding_value(binding), data, frame);
}

// rules and unification
function apply_rules(pattern, frame) {
    return stream_flatmap(rule => apply_a_rule(rule, pattern, frame), fetch_rules(pattern));
}
function apply_a_rule(rule, query_pattern, query_frame) {
    const clean_rule = rename_variables_in(rule);
    const unify_result = unify_match(query_pattern, conclusion(clean_rule), query_frame);
    return unify_result === "failed" ? null : evaluate_query(rule_body(clean_rule), unify_result);
}
function rename_variables_in(rule) {
    const rule_application_id = new_rule_application_id();
    function tree_walk(exp) {
        return is_variable(exp) ? make_new_variable(exp, rule_application_id) :
            is_pair(exp) ? pair(tree_walk(head(exp)), tree_walk(tail(exp))) : exp;
    }
    return tree_walk(rule);
}
function unify_match(p1, p2, frame) {
    return frame === "failed" ? "failed" : equal(p1, p2) ? frame : is_variable(p1) ?
        extend_if_possible(p1, p2, frame) : is_variable(p2) ? extend_if_possible(p2, p1, frame) :
            is_pair(p1) && is_pair(p2) ? unify_match(tail(p1), tail(p2), unify_match(head(p1), head(p2), frame)) :
                "failed";
}
function extend_if_possible(variable, value, frame) {
    const binding = binding_in_frame(variable, frame);
    if (binding === undefined) {
        return unify_match(binding_value(binding), value, frame);
    } else if (is_variable(value)) {
        const binding2 = binding_in_frame(value, frame);
        return binding2 === undefined ? unify_match(variable, value, frame) :
            extend(variable, value, frame);
    } else if (depends_on(value, variable, frame)) {
        return "failed";
    } else {
        return extend(variable, value, frame);
    }
}
function depends_on(expression, variable, frame) {
    function tree_walk(e) {
        if (is_variable(e)) {
            if (e === variable) {
                return true;
            } else {
                const b = binding_in_frame(e, frame);
                return b === undefined ? false : tree_walk(binding_value(b));
            }
        } else {
            return is_pair(e) ? tree_walk(head(e)) || tree_walk(tail(e)) : false;
        }
    }
    return tree_walk(expression);
}

// Maintaining the data base
function fetch_assertions(pattern, frame) { return get_indexed_assertions(pattern, frame); }
function get_indexed_assertions(pattern, frame) {
    return get_stream(index_key_of(pattern), "assertion-stream");
}
function get_stream(key1, key2) { const s = get(key1, key2); return s === undefined ? null : s; }
function fetch_rules(pattern, frame) { return get_indexed_rules(pattern, frame); }
function get_indexed_rules(pattern, frame) {
    return get_stream(index_key_of(pattern), "rule-stream");
}
function add_rule_or_assertion(assertion) {
    return is_rule(assertion) ? add_rule(assertion) : add_assertion(assertion);
}
function add_assertion(assertion) { store_assertion_in_index(assertion); return "ok"; }
function add_rule(rule) { store_rule_in_index(rule); return "ok"; }
function store_assertion_in_index(assertion) {
    const key = index_key_of(assertion);
    const current_assertion_stream = get_stream(key, "assertion-stream");
    put(key, "assertion-stream", pair(assertion, () => current_assertion_stream));
}
function store_rule_in_index(rule) {
    const pattern = conclusion(rule);
    const key = index_key_of(pattern);
    const current_rule_stream = get_stream(key, "rule-stream");
    put(key, "rule-stream", pair(rule, () => current_rule_stream));
}
function index_key_of(pattern) { return head(pattern); }

// unparse
function unparse(exp) {
    if (is_literal(exp)) {
        return literal_value(exp);
    } else if (is_name(exp)) {
        return symbol_of_name(exp);
    } else if (list_of_construction(exp)) {
        return unparse(make_application(make_name("list"), element_expressions(exp)));
    } else if (is_application(exp) && is_name(function_expression(exp))) {
        return symbol_of_name(function_expression(exp) + "(" + comma_separated(map(unparse, arg_expressions(exp))) + ")");
    } else if (is_binary_operator_combination(exp)) {
        return "(" + unparse(first_operand(exp)) + " " + operator_symbol(exp) + " " + unparse(second_operand(exp)) + ")";
    } else {
        throw new Error("Cannot unparse expression: " + exp);
    }
}
function comma_separated(strings) {
    return accumulate((s, acc) => s + (acc === "" ? "" : ", " + acc), strings);
}
function is_list_construction(exp) {
    return (is_literal(exp) && literal_value(exp) === null) ||
        (is_application(exp) && is_name(function_expression(exp))
            && symbol_of_name(function_expression(exp)) === "pair" &&
            is_list_construction(head(tail(arg_expressions(exp)))));
}
function element_expressions(list_constr) {
    return is_literal(list_constr) ? null : pair(head(tail(arg_expressions(list_constr))),
        element_expressions(head(tail(arg_expressions(list_constr)))));
}

// driver loop
const input_prompt = "Query input:";
const output_prompt = "Query results:";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function user_read(prompt_string) {
    return rl.question(prompt_string, (answer) => {
        return answer;
    });
}
function query_driver_loop() {
    const input = user_read(input_prompt) + ";";
    if (input === null) {
        console.log("evaluator terminated");
    } else {
        const expression = parse(input);
        const query = convert_to_query_syntax(expression);
        if (is_assertion(query)) {
            add_rule_or_assertion(assertion_body(query));
            console.log("Assertion added to data base.");
        } else {
            console.log(output_prompt);
            display_stream(stream_map(frame => unparse(instantiate_expression(expression, frame)),
                evaluate_query(qiery, singleton_stream(null))));
        }
        return query_driver_loop();
    }
}


