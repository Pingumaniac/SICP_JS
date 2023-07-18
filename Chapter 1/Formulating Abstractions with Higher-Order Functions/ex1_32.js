const accumulate = (combiner, null_value, term, a, next, b) => {
    const iter = (a, result) => {
        return a > b ? result : iter(next(a), combiner(result, term(a)));
    }
    return iter(a, null_value);
}

const sum = (term, a, next, b) => {
    return accumulate((x, y) => x + y, 0, term, a, next, b);
}

const product = (term, a, next, b) => {
    return accumulate((x, y) => x * y, 1, term, a, next, b);
}

const accumulate_recursive = (combiner, null_value, term, a, next, b) => {
    return a > b ? null_value : combiner(term(a), accumulate_recursive(combiner, null_value, term, next(a), next, b));
}
