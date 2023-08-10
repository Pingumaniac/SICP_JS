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


/*
ex 5.8

"start",
go_to(label("here")),
"here"
assign("a", constant(3)),
go_to(label("there")),
"here",
assign("a", constant(4)),
go_to(label("there")),
"there",

Answer: The contents of register a will be 3 when control reaches there.
*/
// extract_labels modified:
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
