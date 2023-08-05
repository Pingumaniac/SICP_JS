function require(p) { if (!p) { amb(); } else { } }
function an_element_of(items) {
    require(items !== null);
    return amb(items[0], an_element_of(items[1]));
}
function an_integer_starting_from(n) { return amb(n, an_integer_starting_from(n + 1)); }
function an_integer_between(low, high) {
    require(low <= high);
    return amb(low, an_integer_between(low + 1, high));
}
function distinct(items) {
    return items === null ? true : items[1] === null ? true : member(items[0], items[1]) === null ?
        distinct(items[1]) : false;
}


function amb_eval(exp) {
    return is_delayed_thunk(exp) ? amb_eval(exp()) : is_amb_exp(exp) ? amb_eval(amb_value(exp)) : exp;
}
function is_delayed_thunk(exp) { return is_pair(exp) && head(exp) === "delayed"; }
function amb_value(exp) { return head(tail(exp)); }
function is_amb_exp(exp) { return is_pair(exp) && head(exp) === "amb"; }
const amb = (...choices) => choices;
function is_pair(x) { return Array.isArray(x) && x.length === 2; }
function head(x) { return x[0]; }
function tail(x) { return x[1]; }
function member(x, xs) { return xs === null ? null : x === head(xs) ? xs : member(x, tail(xs)); }

function sicp_js_puzzle() {
    // Chapter order: 1 = Functions, 2 = Data, 3 = State, 4 = Meta, 5 = Register Machines
    const alyssa_checks = 4;
    const ben_checks = 5;
    const louis_checks = 5;
    const eva_checks = an_element_of([1, 2, 3]);
    const louis_solves = 1;
    require(eva_checks !== louis_solves);
    require(eva_checks !== 2);
    const eva_solves = an_element_of([2, 3, 4]);
    require(eva_solves !== 5);
    const alyssa_solves = 2;
    const ben_solves = 5;
    const cy_solves = 3;
    require(distinct([alyssa_solves, ben_solves, cy_solves, eva_solves, louis_solves]));
    require(distinct([alyssa_checks, ben_checks, eva_checks, louis_checks]));
    require(eva_solves === louis_checks);
    return { "Alyssa": alyssa_checks, "Ben": ben_checks, "Eva": eva_checks, "Louis": louis_checks };
}

const result = amb_eval(sicp_js_puzzle);
if (result) {
    console.log(result); // Output will contain who checks the exercises in the Data chapter
} else {
    console.log('No solution found');
}
