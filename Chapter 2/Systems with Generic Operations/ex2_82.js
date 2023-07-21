function Pair(left, right) { this.left = left; this.right = right; }
const head = items => items === null || items === undefined ? null : items.left;
const tail = items => items === null || items === undefined ? null : items.right;
const list = (...items) => items.length === 0 ? null : new Pair(items[0], list(...items.slice(1)));
const for_each = (f, list) => list === null ? null : new Pair(f(head(list)), for_each(f, tail(list)));
const pair = (x, y) => new Pair(x, y);
const is_pair = x => x instanceof Pair;
const map = (f, sequence) => accumulate((x, y) => pair(f(x), y), null, sequence);
const append = (seq1, seq2) => accumulate(pair, seq2, seq1);
const length = (sequence) => { return accumulate((x, y) => y + 1, 0, sequence); }
const enumerate_interval = (low, high) => low > high ? null : pair(low, enumerate_interval(low + 1, high))

const print_list = (list) => {
    if (list === null) {
        return '';
    } else if (head(list) instanceof Pair) {
        return '(' + print_list(head(list)) + ') ' + print_list(tail(list));
    } else {
        return head(list) + ' ' + print_list(tail(list));
    }
};
const filter = (predicate, sequence) => {
    return sequence === null ? null : predicate(head(sequence)) ? pair(head(sequence), filter(predicate, tail(sequence))) : filter(predicate, tail(sequence));
}
const accumulate = (op, initial, sequence) => {
    return sequence === null ? initial : op(head(sequence), accumulate(op, initial, tail(sequence)));
}
const remove = (item, sequence) => {
    return sequence === null ? null : item === head(sequence) ? tail(sequence) : pair(head(sequence), remove(item, tail(sequence)));
}
const member = (item, x) => x === null ? false : item === head(x) ? true : member(item, tail(x));
const equal = (list1, list2) => {
    if (list1 === null && list2 === null) {
        return true;
    } else if (list1 === null || list2 === null) {
        return false;
    } else if (head(list1) instanceof Pair && head(list2) instanceof Pair) {
        return equal(head(list1), head(list2)) && equal(tail(list1), tail(list2));
    } else {
        return head(list1) === head(list2) && equal(tail(list1), tail(list2));
    }
}

const attach_tag = (tag, contents) => pair(tag, contents);
const add = (x, y) => apply_generic("add", list(x, y));
const sub = (x, y) => apply_generic("sub", list(x, y));
const mul = (x, y) => apply_generic("mul", list(x, y));
const div = (x, y) => apply_generic("div", list(x, y));

let operations = {};
const put = (op, type, item) => {
    if (operations[op] === undefined) {
        operations[op] = {};
    }
    operations[op][type] = item;
};

const install_javascript_number_package = () => {
    const tag = (x) => attach_tag("javascript_number", x);
    put("add", list("javascript_number", "javascript_number"), (x, y) => tag(x + y));
    put("sub", list("javascript_number", "javascript_number"), (x, y) => tag(x - y));
    put("mul", list("javascript_number", "javascript_number"), (x, y) => tag(x * y));
    put("div", list("javascript_number", "javascript_number"), (x, y) => tag(x / y));
    put("make", "javascript_number", (x) => tag(x));
    return "done";
}

const make_javascript_number = n => get("make", "javascript_number")(n);

const install_rational_package = () => {
    const numer = x => head(x);
    const denom = x => tail(x);
    const add_rat = (x, y) => make_rat(add(mul(numer(x), denom(y)), mul(numer(y), denom(x))), mul(denom(x), denom(y)));
    const sub_rat = (x, y) => make_rat(sub(mul(numer(x), denom(y)), mul(numer(y), denom(x))), mul(denom(x), denom(y)));
    const mul_rat = (x, y) => make_rat(mul(numer(x), numer(y)), mul(denom(x), denom(y)));
    const div_rat = (x, y) => make_rat(mul(numer(x), denom(y)), mul(denom(x), numer(y)));
    const tag = x => attach_tag("rational", x);
    put("add", list("rational", "rational"), (x, y) => tag(add_rat(x, y)));
    put("sub", list("rational", "rational"), (x, y) => tag(sub_rat(x, y)));
    put("mul", list("rational", "rational"), (x, y) => tag(mul_rat(x, y)));
    put("div", list("rational", "rational"), (x, y) => tag(div_rat(x, y)));
    put("make", "rational", (n, d) => tag(make_rat(n, d)));
    return "done";
}

const make_rational = (n, d) => get("make", "rational")(n, d);

const install_complex_package = () => {
    const make_from_real_imag = (x, y) => attach_tag("complex_from_real_imag", pair(x, y));
    const make_from_mag_ang = (r, a) => attach_tag("complex_from_mag_ang", pair(r, a));
    const add_complex = (z1, z2) => make_from_real_imag(real_part(z1) + real_part(z2), imag_part(z1) + imag_part(z2));
    const sub_complex = (z1, z2) => make_from_real_imag(real_part(z1) - real_part(z2), imag_part(z1) - imag_part(z2));
    const mul_complex = (z1, z2) => make_from_mag_ang(magnitude(z1) * magnitude(z2), angle(z1) + angle(z2));
    const div_complex = (z1, z2) => make_from_mag_ang(magnitude(z1) / magnitude(z2), angle(z1) - angle(z2));
    const tag = x => attach_tag("complex", x);
    const add_complex_to_javascript_num = (z, x) => make_complex_from_real_imag(real_part(z) + x, imag_part(z));
    put("add", list("complex", "javascript_number"), (z, x) => tag(add_complex_to_javascript_num(z, x)));
    put("sub", list("complex", "complex"), (x, y) => tag(sub_complex(x, y)));
    put("mul", list("complex", "complex"), (x, y) => tag(mul_complex(x, y)));
    put("div", list("complex", "complex"), (x, y) => tag(div_complex(x, y)));
    put("make_from_real_imag", "complex", (x, y) => tag(make_from_real_imag(x, y)));
    put("make_from_mag_ang", "complex", (r, a) => tag(make_from_mag_ang(r, a)));
    put("real_part", list("complex"), real_part);
    put("imag_part", list("complex"), imag_part);
    put("magnitude", list("complex"), magnitude);
    put("angle", list("complex"), angle);
    return "done";
}

const make_complex_from_real_imag = (x, y) => get("make_from_real_imag", "complex")(x, y);
const make_complex_from_mag_ang = (r, a) =>  get("make_from_mag_ang", "complex")(r, a);
const type_tag = datum => typeof datum;
const contents = datum => datum;
const is_equal = (x, y) => apply_generic("is_equal", list(x, y));
const is_equal_to_zero = x => apply_generic("is_equal_to_zero", list(x));

const coerce = {};
const put_coercion = (type1, type2, coercionFn) => {
    if (!coerce[type1]) {
        coerce[type1] = {};
    }
    coerce[type1][type2] = coercionFn;
};
const get_coercion = (type1, type2) => coerce[type1] && coerce[type1][type2] ? coerce[type1][type2] : null;

const javascript_number_to_complex = n => make_complex_from_real_imag(n, 0);
put_coercion("javascript_number", "complex", javascript_number_to_complex);

/*
This is a strategy to attempt to coerce all the aguments to the type of the first argument,
then to the type of the second argument, and so on as the question said.
*/
const apply_generic = (op, args) => {
    let type_tags = args.map(arg => arg.type);
    let proc = get(op, type_tags);
    if(proc) {
        return proc(args.map(arg => arg.contents));
    } else {
        for(let i = 0; i < type_tags.length; i++) {
            for (let j = 0; j < type_tags.length; j++) {
                if (i != j) {
                    let types = get_coercion(type_tags[i], type_tags[j]);
                    if(types) {
                        let new_args = args.map((arg, index) => {
                            if(index === j) {
                                return put_coercion(arg, types[1]);
                            } else {
                                return arg;
                            }
                        });
                        return apply_generic(op, new_args);
                    }
                }
            }
        }
        throw error(list(op, type_tags), "no method for these types");
    }
}
/*
A counter example in which the new implementation of apply_generic doest not work:
when e.g. apply_generic(multiply, [3, "5 times"])
this should return "5 times 5 times 5 times"
but the new implementation will either try to convert 3 into string or "5 times" into integer
and then fail to find the method for the type.
*/


function javascript_number_to_javascript_number(n) { return n; }
function complex_to_complex(n) { return n; }
put_coercion("javascript_number", "javascript_number", javascript_number_to_javascript_number);
put_coercion("complex", "complex", complex_to_complex);
function exp(x, y) { return apply_generic("exp", list(x, y)); }
put("exp", list("javascript_number", "javascript_number"), (x, y) => Math.exp(x, y));
