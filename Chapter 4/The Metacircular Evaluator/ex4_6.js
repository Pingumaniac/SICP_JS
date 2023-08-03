/*
(a)
assume that

let* x = 3;
let* y = x + 2;
let* z = x + y + 5;
display(x * z);

is equivalent with
*/
{
    let x = 3;
    {
        let y = x + 2;
        {
            let z = x + y + 5;
            console.log(x * z);
        }
    }
}


/*
Write a program in such an extendfed JS language that behaves differently when
some occurances of the keyword let is replaced by let*

{
    let x = 1;
    {
        let x = x + 1;
        console.log(x);
    }
}

will throw an error because the inner x is not defined yet when it is used when defining x.

{
    let* x = 1;
    {
        let* x = x + 1;
        console.log(x);
    }
}

outputs 2 because the value of x for defining inner x is defined in the outer scope.
*/
// (b)
function parse_let_star_expression(symbols, body) { return ["let*", [symbols, body]];}
function is_let_star_expression(expr) { return is_tagged_list(expr, "let*");}
function let_star_variable(expr) { return [expr[1][0]]; }
function let_star_body(expr) { return [expr[1][1]]; }
// (c)
function let_star_to_nested_let(expr) {
    if (let_star_bindings(expr).length === 0) {
        return let_star_body(expr);
    } else {
        const first_binding = first_let_star_binding(expr);
        const remaining_bindings = rest_let_star_bindings(expr);
        return make_let_expression(list(first_binding),
                                   let_star_to_nested_let(make_let_star_expression(remaining_bindings,
                                                                                    let_star_body(expr))));
    }
}
function let_star_bindings(expr) { return expr[1][0]; }
function let_star_body(expr) { return expr[1][1]; }
function first_let_star_binding(expr) { return let_star_bindings(expr)[0]; }
function rest_let_star_bindings(expr) { return let_star_bindings(expr)[1]; }
function make_let_expression(bindings, body) { return ["let", bindings, body]; }
function make_let_star_expression(bindings, body) { return ["let*", bindings, body]; }
/*
(d) Directly evaluating let* instead of converting into let does not work.
This because it will then need to deal with the creation of all nested environments,
which is not a way the evaluate function is designed to work.
The evaluate function handles each syntactic form in a way that matches
the structure of that form. Adding a new clause for let* will make the evaluate function
extremlly complex.
*/
