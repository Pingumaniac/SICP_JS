function read_compile_execute_print_loop_machine() {
    const machine = make_new_machine();
    const ops = [
        ["read", read],
        ["print", print],
        ["compile", compile],
        ["assemble", assemble]
    ];
    machine.install_operations(ops);
    const controller = [
        "start",
        ["perform", ["op", "read"], ["reg", "input"]],
        ["perform", ["op", "compile"], ["reg", "input"], ["reg", "compiled_code"]],
        ["perform", ["op", "assemble"], ["reg", "compiled_code"], ["reg", "assembled_code"]],
        ["assign", "val", ["reg", "assembled_code"]],
        ["perform", machine.start],
        ["perform", ["op", "print"], ["reg", "val"]],
        ["goto", ["label", "start"]]
    ];
    machine.install_instruction_sequence(assemble(controller, machine));
    return machine;
}

const rcep_test_machine = read_compile_execute_print_loop_machine();
rcep_test_machine.start();
