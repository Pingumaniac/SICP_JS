/*
An example that needs forcing of actual_value instead of evaluate is:

const double = x => x * 2;
const add_ten = x => x + 10;

when we call double(add_ten(3)), we want to force the evaluation of add_ten(3) to 13,
then pass 13 to double, and get 26.
*/

