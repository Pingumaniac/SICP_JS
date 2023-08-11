// Helper functions
function error(message, string) { throw new Error(message, string); }
function for_each(fun, list) {
    return list === null ? true : fun(list[0]) && for_each(fun, list[1]);
}
function pair(x, y) { return [x, y]; }
function assoc(key, records) {
    return records === null ? undefined : key === records[0][0] ? records[0][1] : assoc(key, records[1]);
}
function append(list1, list2) {
    return list1 === null ? list2 : pair(list1[0], append(list1[1], list2));
}
function is_string(value) { return typeof value === 'string'; }
function is_pair(x) { return x instanceof Array && x.length === 2; }
function is_tagged_list(component, the_tag) {
    return is_pair(component) && component[0] === the_tag;
}
function map(fun, items) {
    return items === null ? null : pair(fun(items[0]), map(fun, items[1]));
}
function apply_in_underlying_javascript(fun, argument_list) {
    return fun.apply(null, argument_list);
}
function make_machine(register_names, ops, controller) {
    const machine = make_new_machine();
    for_each(register_name => machine.allocate_register(register_name), register_names);
    machine.install_operations(ops);
    machine.install_instruction_sequence(assemble(controller, machine));
    return machine;
}
// removed dispatch
function make_register(name) {
    let contents = "*unassigned*";
    return {
        get: () => contents,
        set: (value) => { contents = value; }
    };
}
function get_contents(register) { return register.get(); }
function set_contents(register, value) { return register.set(value); }
// removed dispatch
function make_stack() {
    let stack = null;
    return {
        push: (x) => { stack = pair(x, stack); return "done"; },
        pop: () => {
            if (stack === null) {
                throw new Error("Empty stack: POP");
            } else {
                const top = stack[0];
                stack = stack[1];
                return top;
            }
        },
        initialize: () => { stack = null; return "done"; }
    };
}
function pop(stack) { return stack.pop(); }
function push(stack, value) { return stack.push(value); }
function start(machine) { return machine.start(); }
function get_register_contents(machine, register_name) {
    return get_contents(machine.get_register(register_name));
}
function set_register_contents(machine, register_name, value) {
    set_contents(machine.get_register(register_name), value);
    return "done";
}
function get_register(machine, register_name) { return machine.get_register(register_name); }
// removed dispatch
function make_new_machine() {
    const pc = make_register("pc");
    const flag = make_register("flag");
    const stack = make_stack();
    let the_instruction_sequence = null;
    let the_ops = [["initialize_stack", () => stack.initialize()]];
    let register_table = [["pc", pc], ["flag", flag]];
    function execute() {
        const insts = pc.get();
        if (insts === null) {
            return "done";
        } else {
            inst_execution_fun(insts[0])();
            return execute();
        }
    }
    return {
        start: () => { pc.set(the_instruction_sequence); return execute(); },
        install_instruction_sequence: (seq) => { the_instruction_sequence = seq; },
        allocate_register: (name) => {
            if (assoc(name, register_table) === undefined) {
                register_table = pair([name, make_register(name)], register_table);
            } else {
                throw new Error("Multiply defined register: " + name);
            }
            return "register allocated";
        },
        get_register: (name) => {
            const val = assoc(name, register_table);
            return val === undefined ? error("Unknown register: ", name) : val;
        },
        install_operations: (ops) => { the_ops = append(the_ops, ops); },
        stack,
        operations: the_ops
    };
}
function make_inst(inst_controller_instruction) { return pair(inst_controller_instruction, null); }
function inst_controller_instruction(inst) { return inst[0]; }
function inst_execution_fun(inst) { return inst[1]; }
function set_instruction_execution_fun(inst, fun) { return inst[1] = fun; }
function make_label_entry(label_name, insts) { return pair(label_name, insts); }
function update_insts(ints, labels, machine) {
    const pc = get_register(machine, "pc");
    const flag = get_register(machine, "flag");
    const stack = machine.stack;
    const ops = machine.operations;
    return for_each(inst =>
        set_instruction_execution_fun(inst,
            make_execution_function(inst_controller_instruction(inst),
                labels, machines, pc, flag, stack, ops)), ints);
}
function lookup_label(labels, label_name) {
    const val = assoc(label_name, labels);
    return val === undefined ? error("Unknown label: ", label_name) : val[1];
}
function assemble(controller, machine) {
    return extract_labels(controller, (insts, labels) => {
        update_insts(insts, labels, machine);
        return insts;
    });
}
function extract_labels(controller, receive) {
    const existingLabels = {};
    function helper(continue_helper, receive_helper) {
        if (continue_helper === null) return receive_helper(null, null);
        return helper(continue_helper[1], (insts, labels) => {
            const next_element = continue_helper[0];
            if (is_string(next_element)) {
                if (existingLabels[next_element]) {
                    throw new Error("Label defined more than once: " + next_element);
                }
                existingLabels[next_element] = true;
                return receive_helper(insts, pair(make_label_entry(next_element, insts), labels));
            } else {
                return receive_helper(pair(make_inst(next_element), insts), labels);
            }
        });
    }
    return helper(controller, receive);
}
function make_execution_function(inst, labels, machine, pc, flag, stack, ops) {
    const inst_type = type(inst);
    if (inst_type === 'assign') {
        return make_assign_ef(inst, machine, labels, ops, pc)
    } else if (inst_type === 'test') {
        return make_test_ef(inst, machine, labels, ops, flag, pc);
    } else if (inst_type === 'branch') {
        return make_branch_ef(inst, machine, labels, flags, pc);
    } else if (inst_type === 'goto') {
        return make_goto_ef(inst, machine, labels, pc);
    } else if (inst_type === 'save') {
        return make_save_ef(inst, machine, stack, pc);
    } else if (inst_type === 'restore') {
        return make_restore_ef(inst, machine, stack, pc);
    } else if (inst_type === 'perform') {
        return make_perform_ef(inst, machine, labels, ops, pc);
    } else {
        throw new Error("Unknown instruction type in make_execution_function: " + inst_type);
    }
}
function type(instruction) { return instruction[0]; }
function make_assign_ef(inst, machine, labels, operations, pc) {
    const target = inst[1];
    const value_exp = assign_value_exp(inst);
    const value_fun = is_operation_exp(value_exp) ?
        make_operation_exp_of(value_exp, machine, labels, operations) :
        make_primitive_exp(value_exp, machine, labels);
    return () => {
        set_register_contents(target, value_fun());
        advance_pc(pc);
    };
}
function assign(register_name, source) { return ["assign", register_name, source]; }
function assign_reg_name(assign_instruction) { return assign_instruction[1][0]; }
function assign_value_exp(assign_instruction) { return assign_instruction[1][1][0]; }
function advance_pc(pc) { pc.set(pc.get()[1]); }
function make_test_ef(inst, machine, labels, operations, flag, pc) {
    const condition = test_condition(inst);
    if (is_operation_exp(condition)) {
        const condition_fun = make_operation_exp(condition, machine, labels, operations);
        return () => { flag.set(condition_fun()); advance_pc(pc); }
    } else {
        throw new Error("Bad TEST instruction: " + inst);
    }
}
function test(condition) { return ["test", condition]; }
function test_condition(test_instruction) { return test_instruction[1][0]; }
function make_branch_ef(inst, machine, labels, flag, pc) {
    const dest = branch_dest(inst);
    if (is_label_exp(dest)) {
        const insts = lookup_label(labels, label_exp_label(dest));
        return () => {
            if (flag.get()) {
                pc.set(insts);
            } else {
                advance_pc(pc);
            }
        }
    } else {
        throw new Error("Bad BRANCH instruction: " + inst);
    }
}
function branch(dest) { return ["branch", dest]; }
function branch_dest(branch_instruction) { return branch_instruction[1][0]; }
function make_goto_ef(inst, machine, labels, pc) {
    const dest = goto_dest(inst);
    if (is_label_exp(dest)) {
        const insts = lookup_label(labels, label_exp_label(dest));
        return () => pc.set(insts);
    } else if (is_register_exp(dest)) {
        const reg = get_register(machine, register_exp_reg(dest));
        return () => pc.set(reg.get());
    } else {
        throw new Error("Bad GOTO instruction: " + inst);
    }
}
function goto(dest) { return ["goto", dest]; }
function goto_dest(goto_instruction) { return goto_instruction[1][0]; }
function save_reg_name(save_instruction) { return save_instruction[1]; }
function restore_reg_name(restore_instruction) { return restore_instruction[1]; }
function make_save_ef(inst, machine, stack, pc) {
    const reg = get_register(machine, save_reg_name(inst));
    return () => { stack.push(reg.get()); advance_pc(pc); };
}
function make_restore_ef(inst, machine, stack, pc) {
    const reg = get_register(machine, restore_reg_name(inst));
    return () => { reg.set(stack.pop()); advance_pc(pc); };
}
function save_inst_reg_name(save_instruction) { return save_instruction[1]; }
function make_perform_ef(inst, machine, labels, operations, pc) {
    const action = perform_action(inst);
    if (is_operation_exp(action)) {
        const action_fun = make_operation_exp(action, machine, labels, operations);
        return () => { action_fun(); advance_pc(pc); };
    } else {
        throw new Error("Bad PERFORM instruction: " + inst);
    }
}
function perform(action) { return ["perform", action]; }
function perform_action(perform_instruction) { return perform_instruction[1][0]; }
function make_primitive_exp_ef(exp, machine, labels) {
    if (is_constant_exp(exp)) {
        const c = constant_exp_value(exp);
        return () => c;
    } else if (is_label_exp(exp)) {
        const insts = lookup_label(labels, label_exp_label(exp));
        return () => insts;
    } else if (is_register_exp(exp)) {
        const r = get_register(machine, register_exp_reg(exp));
        return () => r.get();
    } else {
        throw new Error("Unknown expression type in make_primitive_exp: " + exp);
    }
}
function reg(name) { return ["reg", name]; }
function is_register_exp(exp) { return is_tagged_list(exp, "reg"); }
function register_exp_reg(exp) { return exp[1][0]; }
function constant(value) { return ["constant", value]; }
function is_constant_exp(exp) { return is_tagged_list(exp, "constant"); }
function constant_exp_value(exp) { return exp[1][0]; }
function label(name) { return ["label", name]; }
function is_label_exp(exp) { return is_tagged_list(exp, "label"); }
function op(name) { return ["op", name]; }
function is_operation_exp(exp) { return is_pair(exp) && is_tagged_list(exp, "op"); }
function operation_exp_op(op_exp) { return op_exp[0][1][0]; }
function operation_exp_operands(op_exp) { return op_exp[1]; }
function lookup_prim(symbol, operations) {
    const val = assoc(symbol, operations);
    return val === undefined ? error(symbol, "Unknown operation: ") : val[1][0];
}
function make_operation_exp_ef(exp, machine, labels, operations) {
    let op = lookup_prim(operation_exp_op(exp), operations);
    let afuns = map(e => make_primitive_exp(e, machine, labels), operation_exp_operands(exp));
    for (let operand of operation_exp_operands(exp)) {
        if (!is_constant_exp(operand) && !is_register_exp(operand)) {
            throw new Error("Invalid operand: operations can only be used with registers and constants");
        }
    }
    return (machine) => {
        let afuns_val = map(aproc => aproc(machine), afuns);
        return apply_in_underlying_javascript(op, afuns_val);
    };
}

/*
ex 5.10
save(y);
save(x);
restore(y);

Part a.
Answer: Some times, we do not have to use "restore(x)" to obtain restore(y) value, by employing
the behavior that restore(y) puts into y the last value saved on the stack, regardless of
what register that value came from.

save(y);
save(x);
...
restore(x); // this line
restore(y);

Part b.
function get_stack(machine) { return machine.stack; }
function save(register_name, machine) {
    let register = machine.get_register(register_name);
    let stack = get_stack(machine);
    stack.push([register_name, register.get()]);
}
function restore(register_name, machine) {
    let stack = get_stack(machine);
    let [saved_reg_name, value] = stack.pop();
    if (saved_reg_name === register_name) {
        let register = machine.get_register(register_name);
        register.set(value);
    } else {
        throw new Error("Mismatched register restore: expected " + register_name +", got " + saved_reg_name);
    }
}

Part c
*/
function initialize_stack(machine) {
    let registers = get_all_registers(machine);
    for (let register of registers) { register.stack = []; }
}
function save(register_name, machine) {
    let register = machine.get_register(register_name);
    register.stack.push(register.get());
}
function restore(register_name, machine) {
    let register = machine.get_register(register_name);
    register.set(register.stack.pop());
}
