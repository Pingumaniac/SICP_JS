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
// ex 4.46
const adjectives = ["adjective", "quick", "brown", "small"];
const adverbs = ["adverb", "quickly", "slowly"];
const conjunctions = ["and", "or", "but"];

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

function parse_sentence() { return ["sentence", parse_noun_phrase(), parse_verb_phrase()]; }
function parse_simple_noun_phrase() { return ["simple-noun-phrase", parse_word(articles), parse_word(nouns)]; }
// ex 4.46
function parse_adjective() { return parse_word(adjectives); }
function parse_adverb() { return parse_word(adverbs); }
function parse_conjunction() { return parse_word(conjunctions); }
function parse_prepositional_phrase() {
    if (not_yet_parsed && member(not_yet_parsed[0], prepositions.slice(1))) {
        const prep = parse_word(prepositions);
        const noun_phrase = parse_noun_phrase();
        return ["prep-phrase", prep, noun_phrase];
    } else {
        return null;
    }
}
function parse_noun_phrase() {
    const simple_noun_phrase = parse_simple_noun_phrase();
    const prep_phrase = parse_prepositional_phrase();
    return prep_phrase ? ["noun-phrase", simple_noun_phrase, prep_phrase] : simple_noun_phrase;
}
function parse_verb_phrase() {
    if (!not_yet_parsed) { return null; }
    const verb = parse_word(verbs);
    const adverb = member(not_yet_parsed[0], adverbs.slice(1)) ? parse_adverb() : null;
    const noun_phrase = parse_noun_phrase();
    if (adverb && noun_phrase) { return [adverb, verb, noun_phrase]; }
    if (adverb) { return [adverb, verb]; }
    if (noun_phrase) { return [verb, noun_phrase]; }
    return verb;
}
