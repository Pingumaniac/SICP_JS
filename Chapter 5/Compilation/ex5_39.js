/*
This is right-to-left evalauation.
The order is determined in the compiler in the following:

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

We can change to left-to-right by not using reverse().

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

There is no change in terms of efficiency.
*/
