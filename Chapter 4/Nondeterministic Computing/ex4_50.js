// ex 4.50
function analyze_evaluation_suceeds_take(expr) {
    const statement = analyze(expr.statement);
    const alternative = analyze(expr.alternative);
    return function (env, succeed, fail) {
        statement(env, succeed, () => {
            alternative(env, succeed, fail);
        });
    };
}
function is_evaluation_suceeds_take(expr) {
    return is_tagged_list(expr, "evaluation_suceeds_take");
}
