function binary_node(key, value) { return { key: key, value: value, left: null, right: null } }

function make_bst_table(root = null) {
    return {
        root: root,
        put: function(key, value) {
            const put_helper = (node, key, value) => {
                if (node === null) {
                    return binary_node(key, value);
                }
                if (key < node.key) {
                    node.left = put_helper(node.left, key, value);
                } else if (key > node.key) {
                    node.right = put_helper(node.right, key, value);
                } else {
                    node.value = value;
                }
                return node;
            };
            this.root = put_helper(this.root, key, value);
        },
        get: function(key) {
            let node = this.root;
            while (node !== null) {
                if (key < node.key) {
                    node = node.left;
                } else if (key > node.key) {
                    node = node.right;
                } else {
                    return node.value;
                }
            }
            return null;
        }
    };
}

const bst = make_bst_table();
bst.put('x', 'south korea');
bst.put('y', 'japan');
bst.put('z', 'taiwan');
console.log(bst.get('x'));  // south korea
console.log(bst.get('y'));  // japan
console.log(bst.get('z'));  // taiwan
