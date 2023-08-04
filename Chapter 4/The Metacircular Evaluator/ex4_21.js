/*
function analyze_sequence(stmts) {
    function sequentially(fun1, fun2) {
        return env => {
            const fun1_val = fun1(env);
            return is_return_value(fun1_val) ? fun1_val : fun2(env);
        };
    }
    function loop(first_fun, rest_funs) {
        return rest_funs === null ? first_fun : loop(sequentially(first_fun, rest_funs[0]), rest_funs[1]);
    }
    const funs = map(analze, stmts);
    return funs === null ? env => undefined : loop(funs[0], funs[1]);
}

v.s.

function analyze_sequence(stmts) {
    function execute_sequence(funs, env) {
        if (funs == null) { return undefined;}
        if (funs[1] == null) { return funs[0](env);}
        const head_val = funs[0](env);
        return is_return_value(head_val) ? head_val : execute_sequence(funs[1], env);
    }
    const funs = map(analyze, stmts);
    return env => execute_sequence(funs, env);

The first version is better because as Eva pointed out although individual sequences have been
recognized in the second version, the sequence itself has not been analyzed.
Hence the sequence itself will be analyzed in the run time, and hence it is less efficient.
*/
