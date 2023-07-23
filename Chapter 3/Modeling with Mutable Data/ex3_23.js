// Used my own representation instead of using dispatch
function make_deque() {
    let front_ptr = null;
    let rear_ptr = null;
    return {
        front_queue: () => front_ptr,
        rear_queue: () => rear_ptr,
        set_front_ptr: (item) => front_ptr = item,
        set_rear_ptr: (item) => rear_ptr = item,
        front_insert_deque: (item) => {
            let new_node = { value: item, next: null };
            if (rear_ptr) {
                rear_ptr.next = new_node;
                rear_ptr = new_node;
            } else {
                front_ptr = new_node;
                rear_ptr = new_node;
            }
        },
        front_delete_deque: () => {
            if (front_ptr) {
                let item = front_ptr.value;
                front_ptr = front_ptr.next;
                if (front_ptr === null) {
                    rear_ptr = null;
                }
                return item;
            } else {
                throw new Error("front_delete_queue called with an empty queue");
            }
        },
        rear_insert_deque: (item) => {
            let new_node = { value: item, next: null };
            if (front_ptr) {
                new_node.next = front_ptr;
                front_ptr = new_node;
            } else {
                front_ptr = new_node;
                rear_ptr = new_node;
            }
        },
        rear_delete_deque: () => {
            if (rear_ptr) {
                let item = rear_ptr.value;
                let current = front_ptr;
                if (current.next === null) {
                    front_ptr = null;
                    rear_ptr = null;
                    return item;
                }
                while (current.next !== rear_ptr) {
                    current = current.next;
                }
                rear_ptr = current;
                rear_ptr.next = null;
                if (rear_ptr === null) {
                    front_ptr = null;
                }
                return item;
            } else {
                throw new Error("rear_delete_queue called with an empty queue");
            }
        },
        is_empty: () => front_ptr === null,
    }
}

// Usage:
let q = make_deque();
q.front_insert_deque("baba")
q.front_insert_deque("mama")
console.log(q.rear_delete_deque())
console.log(q.rear_delete_deque())
