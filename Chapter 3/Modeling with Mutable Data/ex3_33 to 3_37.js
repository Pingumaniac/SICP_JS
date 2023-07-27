// rewrited sample code given in the book in more JS style
const make_connector = () => {
    let value = undefined;
    let informant = undefined;
    let constraints = new Set();
    return {
        set_value: function (new_value, setter) {
            if (value === undefined) {
                value = new_value;
                informant = setter;
                for (let constraint of constraints) {
                    if (constraint !== setter) {
                        constraint.new_value();
                    }
                }
            } else if (value !== new_value) {
                throw new Error(`Error! Contradiction: (${value}, ${new_value})`);
            }
        },
        forget_value: function (retractor) {
            if (retractor === informant) {
                informant = undefined;
                value = undefined;
                for (let constraint of constraints) {
                    if (constraint !== retractor) {
                        constraint.forget_value();
                    }
                }
            }
        },
        connect: function (newConstraint) {
            constraints.add(newConstraint);
            if (value !== undefined) {
                newConstraint.new_value();
            }
        },
        has_value: function () { return value !== undefined; },
        get_value: function () { return value; }
    };
}
const adder = (a1, a2, sum) => {
    const process = () => {
        if (a1.has_value() && a2.has_value()) {
            sum.set_value(a1.get_value() + a2.get_value(), process);
        } else if (a1.has_value() && sum.has_value()) {
            a2.set_value(sum.get_value() - a1.get_value(), process);
        } else if (a2.has_value() && sum.has_value()) {
            a1.set_value(sum.get_value() - a2.get_value(), process);
        }
    }
    const forget = () => {
        a1.forget_value(process);
        a2.forget_value(process);
        sum.forget_value(process);
        process();
    }
    a1.connect({ new_value: process, forget_value: forget });
    a2.connect({ new_value: process, forget_value: forget });
    sum.connect({ new_value: process, forget_value: forget });
    process();
}
const multiplier = (m1, m2, product) => {
    const process = () => {
        if (m1.has_value() && m2.has_value()) {
            product.set_value(m1.get_value() * m2.get_value(), process);
        } else if (m1.has_value() && product.has_value()) {
            m2.set_value(product.get_value() / m1.get_value(), process);
        } else if (m2.has_value() && product.has_value()) {
            m1.set_value(product.get_value() / m2.get_value(), process);
        }
    }
    const forget = () => {
        m1.forget_value(process);
        m2.forget_value(process);
        product.forget_value(process);
        process();
    }
    m1.connect({ new_value: process, forget_value: forget });
    m2.connect({ new_value: process, forget_value: forget });
    product.connect({ new_value: process, forget_value: forget });
    process();
}
const constant = (value, connector) => { connector.set_value(value, function () { }); }
function probe(name, connector) {
    const print = () => {
        console.log("Probe: " + name + " temp = " + (connector.has_value() ? connector.get_value() : '?'));
    }
    connector.connect({ new_value: print, forget_value: print });
    print();
}
const celsius_fahrenheit_converter = (c, f) => {
    const u = make_connector();
    const v = make_connector();
    const w = make_connector();
    const x = make_connector();
    const y = make_connector();
    multiplier(c, w, u);
    multiplier(v, x, u);
    adder(v, y, f);
    constant(9, w);
    constant(5, x);
    constant(32, y);
}

const C = make_connector();
const F = make_connector();
celsius_fahrenheit_converter(C, F);
probe("Celsius", C);
probe("Fahrenheit", F);
C.set_value(25, "user");
// F.set_value(212, "user"); will throw an error
C.forget_value("user");
F.set_value(212, "user");
F.forget_value("user");

// ex 3.33
const averager = (a, b, c) => {
    const x = make_connector();
    const y = make_connector();
    adder(a, b, x);
    multiplier(c, y, x);
    multiplier(c, y, b);
    multiplier(b, y, a);
}
// end of ex 3.33

/*
ex. 3.34

function squarer(a, b) {
    return multiplier(a, a, b);
}

Flaw: This will cause infinite loop when b is set to a value.
*/

// ex 3.35
const squarer = (a, b) => {
    return {
        process_new_value: function () {
            if (b.has_value()) {
                if (b.get_value() < 0) {
                    throw new Error(`${b.get_value}, square less than 0 -- squarer`);
                } else {
                    a.set_value(Math.sqrt(b.get_value()), this.process_new_value);
                }
            } else {
                a.forget_value(this.process_new_value);
            }
        },
        process_forget_value: function () {
            a.forget_value(this.process_new_value);
            b.forget_value(this.process_new_value);
        },
    }
}
// end of ex 3.35

// ex 3.36
const a = make_connector();
const b = make_connector();
a.set_value(10, "user");
/*
for_each_except(setter, inform_about_value, constraints);

environment diagram in which the above expression is called and evaluated:

a: { value: 10, informant: "user", constraints: [b] }
b: { value: 10, informant: "user", constraints: [a] }
setter: "user"
inform_about_value: undefined
constraints: [b]

global environment:
a: { value: 10, informant: "user", constraints: [b] }
b: { value: 10, informant: "user", constraints: [a] }
for_each_except: function (setter, informant, constraints) { ... }

frame 1:
setter: "user"
informant: undefined
constraints: [b]

frame 2:
setter: "user"
informant: undefined
constraints: [a]
*/

// ex 3.37
const cplus = (x, y) => {
    const z = make_connector();
    adder(x, y, z);
    return z;
}
const cminus = (x, y) => {
    const z = make_connector();
    adder(y, z, x);
    return z;
}
const cmul = (x, y) => {
    const z = make_connector();
    multiplier(x, y, z);
    return z;
}
const cdiv = (x, y) => {
    const z = make_connector();
    multiplier(y, z, x);
    return z;
}
const cv = (x) => {
    const z = make_connector();
    constant(x, z);
    return z;
}
