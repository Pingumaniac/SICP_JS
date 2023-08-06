function require(p) { if (!p) { amb(); } else { } }
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
const adjectives = ["adjective", "quick", "brown", "small"];
const adverbs = ["adverb", "quickly", "slowly"];
const conjunctions = ["and", "or", "but"];

let not_yet_parsed = null;

function parse_input(input) {
    not_yet_parsed = input;
    const sent = parse_sentence();
    require(not_yet_parsed === null);
    return sent;
}

function parse_sentence() { return ["sentence", parse_noun_phrase(), parse_verb_phrase()]; }
function parse_simple_noun_phrase() { return ["simple-noun-phrase", parse_word(articles), parse_word(nouns)]; }
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

// ex 4.47
function an_element_of(items) {
    if (items.length === 0) { return null; }
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}
function parse_word(word_list) { return [word_list[0], an_element_of(word_list.slice(1))]; }
function generate_sentence() { return construct_sentence(parse_sentence()); }
function construct_sentence(sentence) {
    if (sentence === null) { return ''; }
    const [type, ...args] = sentence;
    if (type === "sentence") {
        return `${construct_sentence(args[0])} ${construct_sentence(args[1])}`;
    } else if (type === "noun-phrase") {
        return `${construct_noun_phrase(args[0])} ${construct_prepositional_phrase(args[2])}`;
    } else if (type === "verb-phrase") {
        return `${construct_verb_phrase(args)}`;
    } else if (type === "prep-phrase") {
        return `${construct_word(args[0])} ${construct_noun_phrase(args[2])}`;
    } else {
        return construct_word(args);
    }
}
function construct_noun_phrase(noun_phrase) {
    const [noun_type, ...args] = noun_phrase;
    if (noun_type === "simple-noun-phrase") {
        return `${construct_word(args[0])} ${construct_word(args[1])}`;
    } else if (noun_type === "noun-phrase") {
        return `${construct_noun_phrase(args[0])} ${construct_prepositional_phrase(args[2])}`;
    } else {
        return construct_word(args);
    }
}
function construct_verb_phrase(verb_phrase) {
    const [verb_type, ...args] = verb_phrase;
    if (verb_type === "verb") {
        return construct_word(args);
    } else if (verb_type === "adverb") {
        return `${construct_word(args[0])} ${construct_verb_phrase(args[1])}`;
    } else {
        return `${construct_word(args[0])} ${construct_noun_phrase(args[1])}`;
    }
}
function construct_prepositional_phrase(prep_phrase) {
    const [prep_type, ...args] = prep_phrase;
    return `${construct_word(args[0])} ${construct_noun_phrase(args[2])}`;
}
function construct_word(word) { return word; }
for (let i = 0; i < 10; i++) { console.log(generate_sentence()); }
