function compile(component, target, linkage) {
    if (is_literal(component)) {
        compile_literal(component, target, linkage);
    } else if (is_name(component)) {
        compile_name(component, target, linkage, compile_time_env);
    } else if (is_application(component)) {
        const operator = head(expr);
        if (operator === "===") {
            return compile_equality(expr, target, linkage);
        } else if (operator === "*") {
            return compile_multiplication(expr, target, linkage);
        } else if (operator === "-") {
            return compile_subtraction(expr, target, linkage);
        } else if (operator === "+") {
            return compile_addition(expr, target, linkage);
        } else {
            return compile_application(expr, target, linkage);
        }
    } else if (is_operator_combination(component)) {
        compile(operator_combination_to_application(component), target, linkage);
    } else if (is_conditional(component)) {
        compile_conditional(component, target, linkage);
    } else if (is_lambda_expression(component)) {
        compile_lambda_expression(component, target, linkage, compile_time_env);
    } else if (is_sequence(component)) {
        compile_sequence(component, target, linkage);
    } else if (is_block(component)) {
        compile_block(component, target, linkage, compile_time_env);
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

function spread_arguments(operands, target) {
    if (length(operands) === 2) {
        const operand1 = head(operands);
        const operand2 = head(tail(operands));
        const code2 = preserving([target], compile(operand2, "arg2", "next"), null);
        const code1 = compile(operand1, "arg1", "next");
        return append_instruction_sequences(code2, code1);
    }
}
function compile_equality(expr, target, linkage) {
    const operands = tail(expr);
    const code = spread_arguments(operands, target);
    return append_instruction_sequences(
        code,
        make_instruction_sequence(
            ["arg1", "arg2"], [target],
            [assign(target, op("===", reg("arg1"), reg("arg2"))),
                ...(linkage === "return" ? [branch(reg("continue"))] : [])]
        ));
}
function compile_multiplication(expr, target, linkage) {
    const operands = tail(expr);
    const code = spread_arguments(operands, target);
    return append_instruction_sequences(
        code,
        make_instruction_sequence(
            ["arg1", "arg2"], [target],
            [assign(target, op("*", reg("arg1"), reg("arg2"))),
                ...(linkage === "return" ? [branch(reg("continue"))] : [])]
        ));
}
function compile_subtraction(expr, target, linkage) {
    const operands = tail(expr);
    const code = spread_arguments(operands, target);
    return append_instruction_sequences(
        code,
        make_instruction_sequence(
            ["arg1", "arg2"], [target],
            [assign(target, op("-", reg("arg1"), reg("arg2"))),
                ...(linkage === "return" ? [branch(reg("continue"))] : [])]
        ));
}
function compile_addition(expr, target, linkage) {
    const operands = tail(expr);
    const code = spread_arguments(operands, target);
    return append_instruction_sequences(
        code,
        make_instruction_sequence(
            ["arg1", "arg2"], [target],
            [assign(target, op("+", reg("arg1"), reg("arg2"))),
                ...(linkage === "return" ? [branch(reg("continue"))] : [])]
        ));
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
        const rev_arg_codes = reverse(arg_codes);
        const code_to_get_last_arg = append_instruction_sequences(
            head(rev_arg_codes), make_instruction_sequence(["val"], ["argl"],
                [assign("argl", [op("list"), reg("val")])]));
    }
    if (tail(rev_arg_codes) === null) {
        return code_to_get_last_arg;
    } else {
        preserving(["env"], code_to_get_last_arg, code_to_get_rest_args(tail(rev_arg_codes)));
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

function preserving(regs, seq1, seq2) {
    if (regs == null) {
        return append_instrunction_sequences(seq1, seq2);
    } else {
        const first_reg = head(regs);
        return needs_register(seq2, first_reg) && modifies_register(seq1, first_reg) ?
            preserving(tail(regs), make_instruction_seqeunce(
                list_union([first_reg], registers_needed(seq1)),
                list_difference(registers_modified(seq1), [first_reg]),
                append([save(first_reg)], append(instructions(seq1), [restore(first_reg)]))),
                seq2) :
            preserving(tail(regs), seq1, seq2);
    }
}

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

function lexical_address_lookup(lexical_address, environment) {
    const [address_frame, address_offset] = lexical_address;
    let frame = environment;
    for (let i = 0; i < address_frame; i++) {
        frame = tail(frame);
        if (frame === null) {
            throw new Error("Frame offset exceeds environment size");
        }
    }
    const variables_in_frame = head(frame);
    const value = variables_in_frame[address_offset];
    if (value === '*unassigned*') {
        throw new Error("Unassigned variable");
    }

    return value;
}
function lexical_address_assign(lexical_address, value, environment) {
    const [address_frame, address_offset] = lexical_address;
    let frame = environment;
    for (let i = 0; i < address_frame; i++) {
        frame = tail(frame);
        if (frame === null) {
            throw new Error("Frame offset exceeds environment size");
        }
    }
    const variables_in_frame = head(frame);
    variables_in_frame[address_offset] = value;
}


function compile_name(component, target, linkage, compile_time_env) {
    const symbol = symbol_of_name(component);
    const lexical_address = find_symbol(symbol, compile_time_env);
    if (lexical_address === 'not found') {
        throw new Error(`Compile-time error: symbol ${symbol} not found`);
    }
    return end_with_linkage(linkage, make_instruction_sequence(["env"], [target],
        [assign(target, [op("lookup_lexical_address_value"), constant(lexical_address), reg("env")])]));
}
function compile_declaration(component, target, linkage) {
    return compile_assignment_declaration(declaration_symbol(component),
        declaration_value_expression(component), constant(undefined), target, linkage);
}
function compile_assignment_declaration(symbol, value_expression, final_value, target, linkage, compile_time_env) {
    const lexical_address = find_symbol(symbol, compile_time_env);
    if (lexical_address === 'not found') {
        throw new Error(`Compile-time error: symbol ${symbol} not found`);
    }
    const get_value_code = compile(value_expression, "val", "next", compile_time_env);
    return end_with_linkage(linkage, preserving(["env"], get_value_code,
        make_instruction_sequence(["env", "val"], [target],
            [perform([op("assign_lexical_address_value"), constant(lexical_address), reg("val"), reg("env")])
                , assign(target, final_value)])));
}

// ex 5.46
function lexical_address(frame, offset) { return [frame, offset]; }
function compile_lambda_body(exp, fun_entry, compile_time_env) {
    const params = lambda_parameter_symbols(exp); // This function is assumed to be defined
    const new_compile_time_env = [...compile_time_env, params.map(sym => ({name: sym, mutability: 'mutable'}))];

    return append_instruction_sequences(
        make_instruction_sequence(["env", "fun", "argl"], ["env"],
            [fun_entry, assign("env", [op("compiled_function_env"), reg("fun")]),
            assign("env", [op("extend_environment"), constant(params), reg("argl"), reg("env")])]),
        compile(append_return_undefined(lambda_body(exp)), "val", "next", new_compile_time_env)
    );
}
function compile_block(start, target, linkage, compile_time_env) {
    const body = block_body(start);
    const locals = scan_out_declarations(body);
    const new_compile_time_env = [...compile_time_env, locals.map(sym => ({name: sym, mutability: 'mutable'}))];

    return append_instruction_sequences(
        make_instruction_sequence(["env"], ["env"],
            [assign("env", [op("extend_environment"), constant(locals), reg("unassigneds"), reg("env")])]),
        compile(body, target, linkage, new_compile_time_env)
    );
}
function block_body(block) { return tail(block); }
function scan_out_declarations(body) {
    const declarations = filter(is_declaration, body);
    return declarations.map(declaration_symbol);
}
function filter(predicate, sequence) {
    if (sequence === null) {
        return null;
    } else {
        const element = head(sequence);
        const rest = tail(sequence);
        return predicate(element) ? pair(element, filter(predicate, rest)) : filter(predicate, rest);
    }
}
function find_symbol(variable, compile_time_env) {
    function search_variable(v, l, n) {
        if (!l.length) return false;
        for (let i = 0; i < l.length; i++) {
            if (v === l[i].name) return { index: i, mutability: l[i].mutability };
        }
        return false;
    }
    function search_frame(frames, f) {
        if (!frames.length) return 'not found';
        const o = search_variable(variable, frames[0], 0);
        if (o !== false) {
            return { address: lexical_address(f, o.index), mutability: o.mutability };
        }
        return search_frame(frames.slice(1), f + 1);
    }
    return search_frame(compile_time_env, 0);
}
function compile_assignment(component, target, linkage, compile_time_env) {
    const symbolInfo = find_symbol(assignment_symbol(component), compile_time_env);
    if (symbolInfo === 'not found') {
        throw new Error("Compile-time error: variable not found");
    }
    if (symbolInfo.mutability === 'immutable') {
        throw new Error("Compile-time error: cannot assign to a constant");
    }
    const get_value_code = compile(assignment_value_expression(component), "val", "next", compile_time_env);
    return end_with_linkage(linkage, preserving(["env"], get_value_code,
        make_instruction_sequence(["env", "val"], [target],
            [perform([op("assign_symbiol_value"), constant(symbolInfo.address),  reg("val"), reg("env")]),
                assign(target, [op("reg"), "val"])]
        )
    ));
}
// end of ex 5.46
