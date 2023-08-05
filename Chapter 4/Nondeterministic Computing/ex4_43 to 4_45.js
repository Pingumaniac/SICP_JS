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
function tail(x) { return x.slice(1); }
function member(x, xs) { return xs === null ? null : x === head(xs) ? xs : member(x, tail(xs)); }
const nouns = ["noun", "student", "professor", "cat", "class"];
const verbs = ["verb", "studies", "lectures", "eats", "sleeps"];
const articles = ["article", "the", "a"];
const prepositions = ["prep", "for", "to", "in", "by", "with"];
let not_yet_parsed = null;

function parse_word(word_list) {
    require(not_yet_parsed !== null);
    require(member(not_yet_parsed[0], word_list.slice(1)) !== null);
    const found_word = not_yet_parsed[0];
    not_yet_parsed = not_yet_parsed.slice(1);
    return [word_list[0], found_word];
}
function parse_input(input) {
    not_yet_parsed = input;
    const sent = parse_sentence();
    require(not_yet_parsed === null);
    return sent;
}

function parse_prepositional_phrase() { return ["prep-phrase", parse_word(prepositions), parse_noun_phrase()]; }
function parse_sentence() { return ["sentence", parse_noun_phrase(), parse_verb_phrase()]; }
function parse_verb_phrase() {
    function maybe_extend(verb_phrase) {
        return amb(verb_phrase, maybe_extend(["verb-phrase", verb_phrase, parse_prepositional_phrase()]));
    }
    return maybe_extend(parse_word(verbs));
}
function parse_simple_noun_phrase() { return ["simple-noun-phrase", parse_word(articles), parse_word(nouns)]; }
function parse_noun_phrase() {
    function maybe_extend(noun_phrase) {
        return amb(noun_phrase, maybe_extend(["noun-phrase", noun_phrase, parse_prepositional_phrase()]));
    }
    return maybe_extend(parse_simple_noun_phrase());
}
//console.log(parse_input(["the", "cat", "eats"]));
//console.log(parse_input(["the", "student", "with", "the", "cat", "sleeps", "in", "the", "class"]));
//console.log(parse_input(["the", "professor", "lectures", "the", "student", "with", "the", "cat"]))

// ex 4.43
console.log(parse_input(["the", "professor", "lectures", "the", "student", "in", "the", "class", "with", "the", "cat"]))

/*
Running this program various times should show 5 different outputs.
But it currently shows the folloiwng error:
function tail(x) { return x.slice(1); }
                            ^
RangeError: Maximum call stack size exceeded

The diffence in shades of meaning among them is how the phrases are grouped together to
form different meanings.

ex 4.44

Our parsing program wouldn’t work if the operands were evaluated in some other order. because
the operands can have difference precedence level. Thus, it does not work when
the order affects the final result such as logic circuits and finite state machines.

ex 4.45
function parse_verb_phrase() {
    return amb(parse_word(verbs), ["verb-phrase", parse_verb_phrase(), parse_prepositional_phrase()]);
}

This does not work. It will cause infinite loop because the parse_verb_phrase() is called
recursively without any base case.
*/
