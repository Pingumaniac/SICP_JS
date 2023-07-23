/*
Used my own representation instead of using dispatch and ued get instead of lookup and put instead of insert.
This is because from the book, get and put functions are then defined in terms of lookup and insert.
const get = operation_table("lookup");
const put = operation_table("insert");
*/
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

const operation_table = make_table();

operation_table.put("+", "operation", (x, y) => x + y);
operation_table.put("-", "operation", (x, y) => x - y);
operation_table.put("*", "operation", (x, y) => x * y);
operation_table.put("/", "operation", (x, y) => x / y);
operation_table.put("**", "operation", (x, y) => x ** y);
operation_table.put("%", "operation", (x, y) => x % y);

console.log(operation_table.get("+", "operation")(2, 2));
console.log(operation_table.get("-", "operation")(2, 1));
console.log(operation_table.get("*", "operation")(3, 2));
console.log(operation_table.get("/", "operation")(8, 4));
console.log(operation_table.get("**", "operation")(2, 3));
console.log(operation_table.get("%", "operation")(8, 3));
