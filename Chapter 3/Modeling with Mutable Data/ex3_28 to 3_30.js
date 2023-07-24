function half_adder(a, b, s, c) {
    const d = make_wire();
    const e = make_wire();
    or_gate(a, b, d);
    and_gate(a, b, c);
    inverter(c, e);
    and_gate(d, e, s);
    return "ok";
}
function full_adder(a, b, c_in, sum, c_out) {
    const s = make_wire();
    const c1 = make_wire();
    const c2 = make_wire();
    half_adder(b, c_in, s, c1);
    half_adder(a, s, sum, c2);
    or_gate(c1, c2, c_out);
    return "ok";
}
function inverter(input, output) {
    function inverter_input() {
        const new_value = logical_not(get_signal(input));
        after_delay(inverter_delay, () => set_signal(output, new_value));
    }
    add_action(input, inverter_input);
    return "ok";
}
function logical_not(s) { return s === 0 ? 1 : s === 0 ? 1 : new Error("Invalid signal"); }
function and_gate(a1, a2, output) {
    function and_action_function() {
        const new_value = logical_and(get_signal(a1), get_signal(a2));
        after_delay(and_gate_delay, () => set_signal(output, new_value));
    }
    add_action(a1, and_action_function);
    add_action(a2, and_action_function);
    return "ok";
}

// ex 3.28
function or_gate(a1, a2, output) {
    function or_action_function() {
        const new_value = logical_or(get_signal(a1), get_signal(a2));
        after_delay(or_gate_delay, () => set_signal(output, new_value));
    }
    add_action(a1, or_action_function);
    add_action(a2, or_action_function);
    return "ok";
}

// ex 3.29 (or_gate using and)gate and inverters
function or_gate_2(a1, a2, output) {
    const not_a1 = make_wire();
    const not_a2 = make_wire();
    const not_output = make_wire();
    inverter(a1, not_a1);
    inverter(a2, not_a2);
    and_gate(not_a1, not_a2, not_output);
    inverter(not_output, output);
    return "ok";
}
// delay time of the or-gate in terms of and-gate and inverter = 3 * and_gate_delay + 2 * inverter_delay

// ex 3.30
function ripple_carry_adder(a, b, sum, carry) {
    const carry_1 = make_wire();
    const carry_2 = make_wire();
    const carry_3 = make_wire();
    full_adder(a[0], b[0], false, sum[0], carry_1);
    full_adder(a[1], b[1], carry_1, sum[1], carry_2);
    full_adder(a[2], b[2], carry_2, sum[2], carry_3);
    full_adder(a[3], b[3], carry_3, sum[3], carry);
    return "ok";
}
// delay time of ripple_carry_adder in terms of and_gate_delay, or_gate_delay, inverter_delay
// = 12 * and_gate_delay + 8 * or_gate_delay + 12 * inverter_delay
