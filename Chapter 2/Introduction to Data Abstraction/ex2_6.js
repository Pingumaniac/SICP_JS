const zero = f => x => x;
const add_1 = n => { return f => x => f(n(f)(x)) };
const one = f => x => f(x);
const two = f => x => f(f(x));
