// used a different implementation of make_queue based on JS array
const make_queue = () => {
    let queue = [];
    return {
        insert_queue: (item) => queue.push(item),
        delete_queue: () => queue.shift(),
        is_empty: () => queue.length === 0,
    };
}
const make_time_segment = (time, queue) => { return { time: time, queue: queue }; }
function segment_time(s) { return s.time }
function segment_queue(s) { return s.queue }
function current_time(agenda) { return agenda.current_time; }
function segments(agenda) { return agenda.segments; }
function set_segments(agenda, segments) { agenda.sgements = segments; }
function first_segment(agenda) { return segments(agenda)[0]; }
function rest_segments(agenda) { return segments(agenda)[1]; }

const agenda = {
    current_time: 0,
    segments: [],
    is_empty: function() { return this.segments.length === 0; },
};
const make_agenda = () => {
    return {
        current_time: 0,
        segments: [],
        is_empty: function() { return this.segments.length === 0; },
    };
}
const propagate = () => {
    if (agenda.is_empty()) {
        return "done";
    } else {
        const first_item = first_agenda_item(agenda);
        first_item();
        remove_first_agenda_item(agenda);
        return propagate();
    }
}

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
        const new_value = logical_not(input.get_signal());
        output.set_signal(new_value);
    }
    input.add_action(inverter_input);
    return "ok";
}
function logical_not(s) { return s === 0 ? 1 : 0; }
function logical_and(a, b) { return a && b ? 1 : 0; }
function logical_or(a, b) { return a || b ? 1 : 0; }
function and_gate(a1, a2, output) {
    function and_action_function() {
        const new_value = logical_and(a1.get_signal(), a2.get_signal());
        output.set_signal(new_value);
    }
    a1.add_action(and_action_function);
    a2.add_action(and_action_function);
    return "ok";
}

// ex 3.28
function or_gate(a1, a2, output) {
    function or_action_function() {
        const new_value = logical_or(a1.get_signal(), a2.get_signal());
        output.set_signal(new_value);
    }
    a1.add_action(or_action_function);
    a2.add_action(or_action_function);
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
// delay time of ripple_carry_adder in terms of and_gate_dela, or_gate_delay, inverter_delay
// = 12 * and_gate_delay + 8 * or_gate_delay + 12 * inverter_delay

function make_wire() {
    let signal_value = 0;
    let action_functions = [];
    return {
        get_signal: () => { return signal_value; },
        set_signal: (new_value) => {
            if (signal_value !== new_value) {
                signal_value = new_value;
                action_functions.forEach(action_function => action_function());
            }
            return "done";
        },
        add_action: (action_function) => {action_functions.push(action_function); }
    }
}

function after_delay(delay, action, agenda) {
    let time = delay;
    agenda.add_to_agenda(time, action);
}
function probe(name, wire) {
    wire.add_action(() => console.log(name + " " + current_time(the_agenda) + ", new value = " + wire.get_signal()));
    return name + " " + current_time(the_agenda) + ", new value = " + wire.get_signal();
}

// Used slice instead of tail() in the given code
function add_to_agenda(time, action, agenda) {
    function belongs_before(segs) { return segs.length === 0 || time < segment_time(segs[0]); }
    function make_new_time_segment(time, action) {
        const q = make_queue();
        q.insert_queue(action);
        return make_time_segment(time, q);
    }
    function add_to_segments(segs) {
        if (segment_time(segs[0]) === time) {
            segment_queue(segs[0]).insert_queue(action);
        } else {
            const rest = segs.slice(1);
            if (belongs_before(rest)) {
                segs.splice(1, 0, make_new_time_segment(time, action));
            } else {
                add_to_segments(rest);
            }
        }
    }
    const s = segments(agenda);
    if (belongs_before(s)) {
        set_segments(agenda, [make_new_time_segment(time, action), ...s]);
    } else {
        add_to_segments(s);
    }
}

function remove_first_agenda_item(agenda) {
    const q = segment_queue(first_segment(agenda));
    q.delete_queue();
    if (q.is_empty()) {
        const rest = rest_segments(agenda);
        set_segments(agenda, rest);
    }
}

function first_agenda_item(agenda) {
    if (agenda.is_empty()) {
        throw new Error("Agenda is empty");
    } else {
        const first_seg = first_segment(agenda);
        set_current_time(agenda, segment_time(first_seg));
        return first_seg.queue.queue[0];
    }
}

const the_agenda = make_agenda();
const inverter_delay = 2;
const and_gate_delay = 3;
const or_gate_delay = 5;

const input_1 = make_wire();
const input_2 = make_wire();
const sum = make_wire();
const carry = make_wire();

// test. added comments for the expected output
console.log(probe("sum", sum)); // sum 0 , new value = 0
console.log(probe("carry", carry)); // carry 0 , new value = 0
console.log(half_adder(input_1, input_2, sum, carry)); // ok
console.log(input_1.set_signal(1));  // done
// but gives wrong answers from here
console.log(propagate()); // sum 8, new value = 1 & done
console.log(input_2.set_signal(1)); // done
console.log(propagate()); // carry 16, new value = 1 & sum 16, new value = 0 & done

/*
ex 3.31
The internal procedure accept_action_procedure defined in make_wire specifies that when a new action procedure
is added to a wire, the procedure is immediately run.

This initialization is necessary b/c the wire's signal value may have changed since the last time the wire's
signal value was computed. If the wire's signal value has changed, then the wire's action procedures must be
run to update the signal values of the wires that depend on the wire.

Case in half_adder:
These have and_gates and or_gates, which depend on the signal values of the input wires.
But these input gates may have states 0 or 1 at the time of initialization.
So, the action procedures of the input wires must be run to update their values b4 the gates are run.

ex 3.32
Here the question compares the use of queue (FIFO) and an ordinary list (LIFO) or in other words stack
to implement the agenda.

Queue is better b/c it allows the agenda to be processed in the order of the time of the events.
If we use a stack, then the agenda will be processed in the reverse order of the time of the events.

Example: Trace the behavior of an and-gate whose inputs change from 0, 1 to 1, 0
in the same segment and say how the behavior would differ if we stored a segment’s procedures in an ordinary list,
adding and removing procedures only at the front (last in, first out).

Queue: The output will be kept as 0.

Stack: The and-gate can see both input as 1 at the same time, so the output will be 1.
*/
