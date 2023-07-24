function TreeNode(key = null, value = null) {
    return {
        key: key,
        value: value,
        children: [],
        put: function(keys, value) {
            if (keys.length === 0) {
                this.value = value;
                return;
            }
            let child = this.children.find(node => node.key === keys[0]);
            if (!child) {
                child = TreeNode(keys[0]);
                this.children.push(child);
            }
            child.put(keys.slice(1), value);
        },
        get: function(keys) {
            if (keys.length === 0) { return this.value; }
            const child = this.children.find(node => node.key === keys[0]);
            if (!child) { return null; }
            return child.get(keys.slice(1));
        }
    }
}

const table = TreeNode();

table.put(["i", "j", "k"], "jfla is pretty");
console.log(table.get(["i", "j", "k"])); // jfla is pretty
table.put(["i", "j"], "jfla is a singer");
console.log(table.get(["i", "j"])); // jfla is a singer
console.log(table.get(["i"])); // null (no value directly stored under "a")
table.put(["i"], "jfla");
console.log(table.get(["i"]));  // jfla

