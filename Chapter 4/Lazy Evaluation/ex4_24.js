function unless(condition, usual_value, exceptional_value) {
    return condition ?  exceptional_value() : usual_value();
}

let a = 10;
let b = 20;

let test_cases = [
    { condition: a > b, usual_value: () => console.log("a is not greater than b"), exceptional_value: () => console.log("a is greater than b") },
    { condition: a < b, usual_value: () => console.log("a is not less than b"), exceptional_value: () => console.log("a is less than b") }
];

for (let test of test_cases) {
    unless(test.condition, test.usual_value, test.exceptional_value);
}

/*
An example where it might be useful to have unless available as a function
rather than a syntactic form
= Testing framework, as here the code for the testing framework should
writes and manipulates other code

*/
