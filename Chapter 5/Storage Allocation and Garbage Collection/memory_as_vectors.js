// Implenting the primitive list operations

// ex. can make a register machine support the instructions
assign(reg1, [op("head"), reg(reg2)]);
assign(reg1, [op("tail"), reg(reg2)]);
// as
assign(reg1, [op("vector_ref"), reg("the_heads"), reg(reg2)]);
assign(reg1, [op("vector_ref"), reg("the_tails"), reg(reg2)]);

// ex instructions
perform([op("set_head"), reg(reg1), reg(reg2)]);
perform([op("set_tail"), reg(reg1), reg(reg2)]);
// are implemented as
perform([op("vector_set"), reg("the_heads"), reg(reg1), reg(reg2)]);
perform([op("vector_set"), reg("the_tails"), reg(reg1), reg(reg2)]);

// ex. pair instruction
assign(reg1, [op("pair"), reg(reg2), reg(reg3)]);
// is implemented as the following sequence of vector operations
perform([op("vector_set"), reg("the_heads"), reg("free"), reg(reg2)]);
perform([op("vector_set"), reg("the_tails"), reg("free"), reg(reg3)]);
assign(reg1, reg("free"));
assign(free, [op("+"), reg("free"), constant("1")]);

// the === operation
[op("==="), reg(reg1), reg(reg2)]

// Implemnting stacks

// save(reg) can be implemented as
assign("the_stack", [op("pair"), reg(reg), reg("the_stack")]);

// restore(reg) can be implemented as
assign(reg, [op("head"), reg("the_stack")]);
assign("the_stack", [op("tail"), reg("the_stack")]);

// perform[op(initialize_stack)] can be implemented as
assign("the_stack", constant(null));
