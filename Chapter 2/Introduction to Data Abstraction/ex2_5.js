const pair = (x, y) => { return m => m(x, y); }
const head = z => { return z((p, q) => p); }
const tail = z => { return z((p, q) => q); }
const gcd = (a, b) => { return b === 0 ? a : gcd(b, a % b); }
const car = (a) => { return 2**a; }
const cdr = (a) => { return 3**a; }
const nonnegative_integer = (a, b) => { return 2**a * 3**b; }
