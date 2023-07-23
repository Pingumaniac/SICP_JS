// Used my own representation instead of using dispatch
function make_queue() {
    let front_ptr = null;
    let rear_ptr = null;
    return {
        front_queue: () => front_ptr,
        rear_queue: () => rear_ptr,
        set_front_ptr: (item) => front_ptr = item,
        set_rear_ptr: (item) => rear_ptr = item,
        insert_queue: (item) => {
            let new_node = { value: item, next: null };
            if (rear_ptr) {
                rear_ptr.next = new_node;
                rear_ptr = new_node;
            } else {
                front_ptr = new_node;
                rear_ptr = new_node;
            }
        },
        delete_queue: () => {
            if (front_ptr) {
                let item = front_ptr.value;
                front_ptr = front_ptr.next;
                if (front_ptr === null) {
                    rear_ptr = null;
                }
                return item;
            } else {
                throw new Error("delete_queue called with an empty queue");
            }
        },
        is_empty: () => front_ptr === null,
    }
}

// Usage:
let q = make_queue();
q.insert_queue("baba")
q.insert_queue("mama")
console.log(q.delete_queue())
console.log(q.delete_queue())
