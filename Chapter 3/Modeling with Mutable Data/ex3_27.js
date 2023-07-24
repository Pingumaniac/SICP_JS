function make_table() {
    const local_table = [];
    return {
        get: (key_1, key_2) => {
            const subtable = local_table.find(([key, _]) => key === key_1);
            if (!subtable) {
                return null;
            }
            const record = subtable[1].find(([key, _]) => key === key_2);
            return record ? record[1] : null;
        },
        put: (key_1, key_2, value) => {
            let subtable = local_table.find(([key, _]) => key === key_1);
            if (!subtable) {
                subtable = [key_1, []];
                local_table.push(subtable);
            }
            let record = subtable[1].find(([key, _]) => key === key_2);
            if (!record) {
                record = [key_2, value];
                subtable[1].push(record);
            } else {
                record[1] = value;
            }
        },
    }
}

const memoize = f => {
    const table = make_table();
    return x => {
        const previously_computed_result = table.get(x);
        if (previously_computed_result === null) {
            const result = f(x);
            table.put(x, result);
            return result;
        } else {
            return previously_computed_result;
        }
    }
}
const memo_fib = memoize(n => n === 0? 0 : n === 1 ? 1 : memo_fib(n - 1) + memo_fib(n - 2));
const fib = n => n === 0? 0 : n === 1 ? 1 : fib(n - 1) + fib(n - 2);

x = memo_fib(3);
/*
Environment diagram to analyze computation of memo_fib(3):

global env
memo_fib: <function>
fib: <function>

memo_fib env:
n: 3
table: <table>

table frame:
local_table: []

local_table frame:
[]

memo_fib computes the nth Fibonacci number in a number of steps proportional to n,
b/c it never computes the ith Fibonacci number more than once where i >= 0 && i <= n.

*/
console.log(x);

// The scheme would still work if we had simply defined memo_fib to be memoize(fib)
y = memoize(fib);
console.log(y(3));
