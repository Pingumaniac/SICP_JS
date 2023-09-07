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

function make_register(name) {
    let contents = "*unassigned*";
    let is_tracing = false;

    return {
        get: () => contents,
        set: (value) => {
            if (is_tracing) {
                console.log(`register ${name}: old contents = ${contents}, new contents = ${value}`);
            }
            contents = value;
        },
        is_tracing: () => is_tracing,
        turn_on_off_tracing: () => {
            is_tracing = !is_tracing;
            console.log(`register ${name}: turned tracing ${is_tracing ? 'on' : 'off'}`);
        }
    };
}

function get_contents(register) { return register.get(); }
function set_contents(register, value) { return register.set(value); }
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

let controller = [];
let labels = [];
let pc = null;
function get_instruction(pc) { return controller[pc]; }
function get_preceding_labels(pc) { return labels.slice(0, pc); }
function make_stack() {
    let stack = null;
    let number_pushes = 0;
    let max_depth = 0;
    let current_depth = 0;
    let instruction_count = 0;
    let tracing = false;
    return {
        push: (x) => {
            stack = pair(x, stack);
            number_pushes = number_pushes + 1;
            current_depth = current_depth + 1;
            max_depth = Math.max(current_depth, max_depth);
            return "done";
        },
        pop: () => {
            if (stack === null) {
                throw new Error("Empty stack: POP");
            } else {
                const top = stack[0];
                stack = stack[1];
                current_depth = current_depth - 1;
                return top;
            }
        },
        initialize: () => {
            stack = null;
            number_pushes = 0;
            max_depth = 0;
            current_depth = 0;
            instruction_count = 0;
            return "done";
        },
        execute() {
            instruction_count++;
            const current_instruction = get_instruction(pc.get());
            const preceding_labels = get_preceding_labels(pc.get());
            if (preceding_labels && preceding_labels.length > 0) {
                console.log("Labels:", preceding_labels.join(", "));
            }
            if (tracing) {
                console.log("Executing instruction:", current_instruction);
            }
            // execute_instruction
            advance_pc(pc);
        },
        print_instruction_count() {
            console.log("Instruction count:", instruction_count);
            instruction_count = 0;
        },
        trace_on() { tracing = true; },
        trace_off() { tracing = false; },
        print_statistics: () => {
            console.log("total pushes = ", number_pushes);
            console.log("maximum depth = ", max_depth);
        }
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
function make_inst(inst_controller_instruction) { return pair(inst_controller_instruction, null); }
function inst_controller_instruction(inst) { return inst[0]; }
function inst_execution_fun(inst) { return inst[1]; }
function set_instruction_execution_fun(inst, fun) { return inst[1] = fun; }
function make_label_entry(label_name, insts) { return pair(label_name, insts); }
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

function list_instructions_without_duplicates(controller) {
    const instruction_set = new Set();
    function extract_instructions(instructions) {
        if (instructions === null) return;
        const inst = instructions[0];
        instruction_set.add(JSON.stringify(inst));
        extract_instructions(instructions[1]);
    }
    extract_instructions(controller);
    const instruction_array = [...instruction_set].map(JSON.parse);
    instruction_array.sort((a, b) => a[0].localeCompare(b[0]));
    return instruction_array;
}

function list_registers_for_gotos(controller) {
    const goto_registers = new Set();
    function extract_gotos(instructions) {
        if (instructions === null) return;
        const inst = instructions[0];
        if (type(inst) === 'goto' && is_register_exp(goto_dest(inst))) {
            goto_registers.add(register_exp_reg(goto_dest(inst)));
        }
        extract_gotos(instructions[1]);
    }
    extract_gotos(controller);
    return [...goto_registers];
}

function list_saved_restored_registers(controller) {
    const saved_restored_registers = new Set();
    function extract_registers(instructions) {
        if (instructions === null) return;
        const inst = instructions[0];
        if (type(inst) === 'save') {
            saved_restored_registers.add(save_inst_reg_name(inst));
        } else if (type(inst) === 'restore') {
            saved_restored_registers.add(restore_reg_name(inst));
        }
        extract_registers(instructions[1]);
    }
    extract_registers(controller);
    return [...saved_restored_registers];
}

function list_register_sources(controller) {
    const register_sources = {};
    function extract_sources(instructions) {
        if (instructions === null) return;
        const inst = instructions[0];
        if (type(inst) === 'assign') {
            const reg_name = assign_reg_name(inst);
            const source = assign_source_exp(inst);
            if (!register_sources[reg_name]) {
                register_sources[reg_name] = new Set();
            }
            register_sources[reg_name].add(JSON.stringify(source));
        }
        extract_sources(instructions[1]);
    }
    extract_sources(controller);
    for (const reg_name in register_sources) {
        register_sources[reg_name] = [...register_sources[reg_name]].map(JSON.parse);
    }
    return register_sources;
}

let breakpoints = [];
function set_breakpoint(machine, label, n) {
    let insts = lookup_label(labels, label);
    let breakpoint_location = insts + n;
    breakpoints.push({ machine: machine, location: breakpoint_location, label: label, offset: n });
    console.log(`Breakpoint set at label ${label} with offset ${n}.`);
}
function cancel_breakpoint(machine, label, n) {
    let insts = lookup_label(labels, label);
    let breakpoint_location = insts + n;
    breakpoints = breakpoints.filter(bp => !(bp.machine === machine && bp.location === breakpoint_location));
    console.log(`A specific breakpoint at at label ${label} with offset ${n} have been removed.`);
}
function cancel_all_breakpoints(machine) {
    breakpoints = breakpoints.filter(bp => bp.machine !== machine);
    console.log("Removed all breakpoints.");
}
function proceed_machine(machine) {
    let next_break_point = breakpoints.find(bp => bp.machine === machine && bp.location > pc.get());
    if (next_break_point) {
        pc.set(next_break_point.location);
        console.log(`Proceeding to next breakpoint at label ${next_break_point.label} with offset ${next_break_point.offset}.`);
    } else {
        console.log("No further breakpoints found. Continuing execution.");
    }
    machine.execute();
}
function make_new_machine() {
    const pc = make_register("pc");
    const flag = make_register("flag");
    const stack = make_stack();
    let the_instruction_sequence = null;
    let the_ops = [["initialize_stack", () => stack.initialize()]];
    let register_table = [["pc", pc], ["flag", flag]];
    const breakpoints = new Set();
    function execute() {
        const insts = pc.get();
        if (insts === null) {
            return "done";
        } else {
            if (breakpoints.has(pc.get())) {
                console.log("Breakpoint hit at instruction", pc.get());
                return "breakpoint";
            }
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
        list_instructions_without_duplicates: () => list_instructions_without_duplicates(the_instruction_sequence),
        list_registers_for_gotos: () => list_registers_for_gotos(the_instruction_sequence),
        list_saved_restored_registers: () => list_saved_restored_registers(the_instruction_sequence),
        list_register_sources: () => list_register_sources(the_instruction_sequence),
        set_breakpoint: (location) => { breakpoints.add(location); },
        clear_breakpoint: (location) => { breakpoints.delete(location); },
        stack,
        operations: the_ops
    };
}

function make_machine(ops, controller) {
    const machine = make_new_machine();
    machine.install_operations(ops);
    machine.install_instruction_sequence(assemble(controller, machine));
    return machine;
}
function extract_labels(controller, receive) {
    const existing_labels = {};
    function helper(continue_helper, receive_helper) {
        if (continue_helper === null) return receive_helper(null, null);
        return helper(continue_helper[1], (insts, labels) => {
            const next_element = continue_helper[0];
            if (is_string(next_element)) {
                if (existing_labels[next_element]) {
                    throw new Error("Label defined more than once: " + next_element);
                }
                existing_labels[next_element] = true;
                return receive_helper(insts, pair(make_label_entry(next_element, insts), labels));
            } else {
                return receive_helper(pair(make_inst(next_element), insts), labels);
            }
        });
    }
    return helper(controller, receive);
}
function update_insts(insts, labels, machine) {
    const pc = get_register(machine, "pc");
    const flag = get_register(machine, "flag");
    const stack = machine.stack;
    const ops = machine.operations;
    return for_each(inst =>
        set_instruction_execution_fun(inst,
            make_execution_function(inst_controller_instruction(inst),
                labels, machines, pc, flag, stack, ops)), insts);
}
function assemble(controller, machine) {
    function extract_labels(text, receive) {
        if (text === null) {
            return receive(null, null, null);
        }
        return extract_labels(text[1], (insts, labels, regs) => {
            const next_inst = text[0];
            if (is_string(next_inst)) {
                return receive(insts, pair(make_label_entry(next_inst, insts), labels), regs);
            } else {
                const new_regs = extract_regs(next_inst, regs);
                return receive(pair(make_inst(next_inst), insts), labels, new_regs);
            }
        });
    }
    function extract_regs(instruction, regs) {
        if (instruction === null) {
            return regs;
        } else if (is_tagged_list(instruction[0], 'reg') && !assoc(instruction[0][1], regs)) {
            return pair(instruction[0][1], extract_regs(instruction[1], regs));
        } else {
            return extract_regs(instruction[1], regs);
        }
    }
    return extract_labels(controller, (insts, labels, regs) => {
        for_each(reg => machine.allocate_register(reg), regs);
        return update_insts(insts, labels, machine);
    });
}
