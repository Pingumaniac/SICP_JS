function compile(component, target, linkage) {
    if (is_literal(component)) {
        compile_literal(component, target, linkage);
    } else if (is_name(component)) {
        compile_name(component, target, linkage);
    } else if (is_application(component)) {
        compile_application(component, target, linkage);
    } else if (is_operator_combination(component)) {
        compile(operator_combination_to_application(component), target, linkage);
    } else if (is_conditional(component)) {
        compile_conditional(component, target, linkage);
    } else if (is_lambda_expression(component)) {
        compile_lambda_expression(component, target, linkage);
    } else if (is_sequence(component)) {
        compile_sequence(component, target, linkage);
    } else if (is_block(component)) {
        compile_block(component, target, linkage);
    } else if (is_return_statement(component)) {
        compile_return_statement(component, target, linkage);
    } else if (is_function_declaration(component)) {
        compile(function_decl_to_constant_decl(component), target, linkage);
    } else if (is_declaration(component)) {
        compile_declaration(component, target, linkage);
    } else if (is_assignment(component)) {
        throw new Error("unknown component type -- compile");
    }
}

function is_pair(x) { return x instanceof Array; }
function head(x) { return x[0]; }
function tail(x) { return x.slice(1); }
function is_tagged_list(component, the_tag) {
    return is_pair(component) && head(component) === the_tag;
}
function is_literal(component) { return is_tagged_list(component, "literal"); }
function is_name(component) { return is_tagged_list(component, "name"); }
function is_application(component) { return is_tagged_list(component, "application"); }
function is_operator_combination(component) { return is_tagged_list(component, "operator_combination"); }
function is_conditional(component) { return is_tagged_list(component, "conditional"); }
function is_lambda_expression(component) { return is_tagged_list(component, "lambda_expression"); }
function is_sequence(component) { return is_tagged_list(component, "sequence"); }
function is_block(component) { return is_tagged_list(component, "block"); }
function is_return_statement(component) { return is_tagged_list(component, "return_statement"); }
function is_function_declaration(component) { return is_tagged_list(component, "function_declaration"); }
function is_declaration(component) { return is_tagged_list(component, "declaration"); }
function is_assignment(component) { return is_tagged_list(component, "assignment"); }

function make_instruction_sequence(needs, modifies, instructions) {
    return [needs, modifies, instructions];
}
function compile_linkage(linkage) {
    if (linkage === "return") {
        make_instruction_sequence(["continue"], null, [go_to(reg("continue"))]);
    } else if (linkage === "next") {
        make_instruction_sequence(null, null, null);
    } else {
        make_instruction_sequence(null, null, [go_to(label(linkage))]);
    }
}

function end_with_linkage(linkage, instruction_sequence) {
    return preserving(["continue"], instruction_sequence, compile_linkage(linkage));
}

function compile_literal(component, target, linkage) {
    const literal = literal_value(component);
    return end_with_linkage(linkage, make_instruction_sequence(null, [target], [assign(target, literal)]));
}

function compile_name(component, target, linkage) {
    const symbol = symbol_of_name(component);
    return end_with_linkage(linkage, make_instruction_sequence([env]), [target],
        [assign(target, [op("lookup_variable_value"), constant(symbol), reg("env")])]);
}

function compile_assignment(component, target, linkage) {
    return compile_assignment_declaration(assignment_symbol(component),
        assignment_value_expression(component), reg("val"), target, linkage);
}

function compile_declaration(component, target, linkage) {
    return compile_assignment_declaration(declaration_symbol(component),
        declaration_value_expression(component), constant(undefined), target, linkage);
}

function compile_assignment_declaration(symbol, value_expression, final_value, target, linkage) {
    const get_value_code = compile(value_expression, "val", "next");
    return end_with_linkage(linkage, preserving(["env"], get_value_code,
        make_instruction_sequence(["env", "val"], [target],
            [perform([op("assign_symbiol_value"), constant(symbol),  reg("val"), reg("env")])
                , assign(target, final_value)])));
}

function compile_conditional(component, target, linkage) {
    const t_branch = make_label("true_branch");
    const f_branch = make_label("false_branch");
    const after_cond = make_label("after_cond");
    const consequent_linkage = linkage === "next" ? after_cond : linkage;
    const p_code = compile(conditional_predicate(component), reg("pred"), "next");
    const c_code = compile(conditional_consequent(component), target, consequent_linkage);
    const a_code = compile(conditional_alternative(component), target, linkage);
    return preserving(["env", "continue"], p_code, append_instruction_sequences(
        make_instruction_sequence(["val"], null, [test([op("is_falsy"), reg("val")]),
            branch(label(f_branch))]),
        append_instruction_sequences(
            parallel_instruction_sequences(
                append_instruction_sequences(t_branch, c_code),
                append_instruction_sequences(f_branch, a_code)),
            after_cond)));
}

let label_counter = 0;
function new_label_number() { label_counter = label_counter + 1; return label_counter; }
function make_label(string) { return string + new_label_number().toString(); }

function compile_sequence(seq, target, linkage) {
    if (is_empty_sequene(seq)) {
        compile_literal(make_literal(undefined), target, linkage);
    } else if (is_last_statement(seq) || is_return_statement(first_statement(seq))) {
        compile(first_statement(seq), target, linkage);
    } else {
        preserving(["env", "continue"], compile(first_statement(seq), reg("val"), "next"),
            compile_sequence(rest_statements(seq), target, linkage));
    }
}

function compile_block(start, target, linkage) {
    const body = block_body(stmt);
    const locals = scan_out_declarations(body);
    const unassigneds = list_of_unassigneds(locals);
    return append_instruction_sequences(
        make_instruction_sequence(["env"], ["env"],
            [assign("env", [op("extend_environment"), constant(locals), constant(unassigneds),
                reg("env")])]), compile(body, target, linkage));
}

function make_compiled_function(entry, env) { return ["compiled_function", entry, env]; }
function is_compiled_function(fun) { return is_tagged_list(fun, "compiled_function"); }
function compiled_function_entry(c_fun) { return head(tail(c_fun)); }
function compiled_function_env(c_fun) { return head(tail(tail(c_fun))); }

function compile_lambda_expression(component, target, linkage) {
    const fun_entry = make_label("entry");
    const after_lambda = make_label("after_lambda");
    const lambda_linkage = linkage === "next" ? after_lambda : linkage;
    return append_instruction_sequences(
        tack_on_instruction_sequence(
            end_with_linkage(lambda_linkage, make_instruction_sequence(["env"], [target],
                [assign(target, op("make_compiled_function"), label(fun_entry), reg("env"))])),
            compile_lambda_body(exp, fun_entry)),
        after_lambda);
}

function compile_lambda_body(exp, fun_entry) {
    const params = lambda_parameter_symbols(exp);
    return append_instruction_sequences(
        make_instruction_sequence(["env", "fun", "argl"], ["env"],
            [fun_entry, assign("env", [op("compiled_function_env"), reg("fun")]),
                assign("env", [op("extend_environment"), constant(params), reg("argl"), reg("env")])]),
        compile(append_return_undefined(lambda_body(exp)), "val", "next"));
}

function append_return_undefined(body) {
    if (contains_return(body)) {
        return body;
    } else {
        return ["sequence", [body, ["return_statement", ["literal", undefined]]]];
    }
}
function contains_return(component) {
    if (!Array.isArray(component)) { return false; }
    const [type, ...rest] = component;
    if (is_return_statement(component)) { return true; }
    if (is_conditional(component)) {
        const thenBranch = head(tail(rest));
        const elseBranch = tail(tail(rest));
        return contains_return(thenBranch) && contains_return(elseBranch);
    }
    if (is_sequence(component)) {
        return rest.some(element => contains_return(element));
    }
    return false;
}

function construct_arglist(arg_codes) {
    if (arg_codes === null) {
        return make_instruction_sequence(null, ["argl"], [assign("argl", constant(null))]);
    } else {
        const code_to_get_first_arg = append_instruction_sequences(
            head(arg_codes), make_instruction_sequence(["val"], ["argl"],
                [assign("argl", [op("list"), reg("val")])]));
    }
    if (tail(arg_codes) === null) {
        return code_to_get_first_arg;
    } else {
        preserving(["env"], code_to_get_first_arg, code_to_get_rest_args(tail(arg_codes)));
    }
}

function code_to_get_rest_args(arg_codes) {
    const code_for_next_arg = preserving(["argl"], head(arg_codes),
        make_instruction_sequence(["val", "argl"], ["argl"],
            [assign("argl", [op("pair"), reg("val"), reg("argl")])]));
    if (tail(arg_codes) === null) {
        return code_for_next_arg;
    } else {
        return preserving(["env"], code_for_next_arg, code_to_get_rest_args(tail(arg_codes)));
    }
}

function compile_function_call(target, linkage) {
    const primitve_branch = make_label("primitive_branch");
    const compiled_branch = make_label("compiled_branch");
    const after_call = make_label("after_call");
    const compiled_linkage = linkage === "next" ? after_call : linkage;
    return append_instruction_sequences(
        make_instruction_sequence(["fun"], null,
            [test([op("is_primitive_function"), reg("fun")]), branch(label(primitive_branch))]),
        append_instruction_sequences(
            parallel_instruction_sequences(
                append_instruction_sequences(compiled_branch, compile_fun_appl(target, compiled_linkage)),
                append_instrunction_sequences(
                    primitive_branch, end_with_linkage(linkage,
                        make_instruction_sequence(["fun", "argl"], [target],
                            [assign(target, [op("apply_primitive_function"), reg("fun"), reg("argl")])])))),
            after_call));
}

const all_regs = ["env", "fun", "val", "argl", "continue"];

function compile_fun_appl(target, linkage) {
    const fun_return = make_label("fun_return");
    if (target === "val" && linkage !== "return") {
        return make_instruction_sequence(["fun"], all_regs,
            [assign("continue", label(linkage)), save("continue"),
                push_marker_to_stack(), assign("val", [op("compiled_function_entry"), reg("fun")]),
                go_to(reg("val"))]);
    } else if (target !== "val" && linakge !== "return") {
        return make_instruction_sequence(["fun"], all_regs,
            [assign("continue", label(fun_return)), save("continue"),
                push_marker_to_stack(), assign("val", [op("compiled_function_entry"), reg("fun")]),
                go_to(reg("val")), fun_return, assign(target, reg("val")), go_to(label(linkage))]);
    } else if (target === "val" && linakge === "return") {
        return make_instruction_sequence(["fun", "continue"], all_regs,
            [save("continue"), push_marker_to_stack(), assign("val",
                [op("compiled_function_entry"), reg("fun")]), go_to(reg("val"))]);
    } else {
        throw new Error("return linkage, target not val -- compile");
    }
}

function compile_return_statement(stmt, target, linkage) {
    return append_instruction_sequences(
        make_instruction_sequence(null, ["continue"],
            [revert_stack_to_marker(), restore("continue")]),
        compile(return_expression(stmt), "val", "return"));
}

function registers_needed(s) { return s === typeof "string" ? null : head(s); }
function registers_moidified(s) { return s === typeof "string" ? null : head(tail(s)); }
function instructions(s) { return s === typeof "string" ? s : head(tail(tail(s))); }
function needs_register(seq, reg) { return member(reg, registers_needed(seq)) !== null; }
function modifies_register(seq, reg) { return member(reg, registers_modified(seq)) !== null; }

function append_instruction_sequences(seq1, seq2) {
    return make_instruction_sequence(
        list_union(registers_needed(seq1), list_difference(registers_needed(seq2), registers_modified(seq1))),
        list_union(registers_modified(seq1), registers_modified(seq2)),
        append(instructions(seq1), instructions(seq2)));
}

function list_union(s1, s2) {
    return s1 === null ? s2 : member(head(s1), s2) === null ?
        [head(s1), list_union(tail(s1), s2)] : list_union(tail(s1), s2);
}
function list_difference(s1, s2) {
    return s1 === null ? null : member(head(s1), s2) === null ?
        [head(s1), list_difference(tail(s1), s2)] : list_difference(tail(s1), s2);
}

// ex 5.40
function preserving(regs, seq1, seq2) {
    if (regs == null) {
        return append_instruction_sequences(seq1, seq2);
    } else {
        const first_reg = head(regs);
        return preserving(tail(regs), make_instruction_sequence(
            list_union([first_reg], registers_needed(seq1)),
            list_difference(registers_modified(seq1), [first_reg]),
            append([save(first_reg)], append(instructions(seq1), [restore(first_reg)]))),
            seq2);
    }
}
/*
Effect: now we will see a lot of save and restore operations which increases memory usage,
decreases run-time efficiency, and adds complexity of the compiled code.

end of ex 5.40
*/

function tack_on_instruction_sequence(seq, body_seq) {
    return make_instruction_sequence(registers_needed(seq), registers_modified(seq),
        append(instructions(seq), instructions(body_seq)));
}
function parallel_instruction_sequences(seq1, seq2) {
    return make_instruction_sequence(
        list_union(registers_needed(seq1), registers_needed(seq2)),
        list_union(registers_modified(seq1), registers_modified(seq2)),
        append(instructions(seq1), instructions(seq2)));
}

function start_eceval() {
    set_register_contents(eceval, "flag", false);
    return start(eceval);
}
function user_print(string, object) {
    function prepare(object) {
        return is_compound_procedure(object) ? "< compound function >" :
            is_primitive_function(object) ? "< primitive function >" :
                is_compiled_function(object) ? "< compiled function >" :
                    is_pair(object) ? [prepare(head(object)), prepare(tail(object))] : object;
    }
    console.log(string + " " + prepare(object).toString());
}

function compile_and_go(program) {
    const instrs = assemble(instructions(compile(program, "val", "return")), eceval);
    const toplevel_names = scan_out_declarations(program);
    const unassigneds = list_of_unassigneds(toplevel_names);
    set_current_environment(extend_environment(toplevel_names, unassigneds, the_global_environment));
    set_register_contents(eceval, "val", instrs);
    set_register_contents(eceval, "flag", true);
    return start(eceval);
}
