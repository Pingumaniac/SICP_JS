const square = x => x * x;
const cube = x => x * x * x;

const cubic = (a, b, c) => {
   return x => cube(x) + a * square(x) + b * x + c;
}
