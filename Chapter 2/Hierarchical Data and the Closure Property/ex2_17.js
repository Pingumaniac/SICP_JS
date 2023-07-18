function list_ref(items, n) { return n === 0 ? head(items) : list_ref(tail(items), n - 1); }
function length(items) {
    function length_iter(a, count) {
        return a === null ? count : length_iter(tail(a), count + 1);
    }
    return length_iter(items, 0);
}
function append(list1, list2) { return list1 === null ? list2 : pair(head(list1), append(tail(list1), list2)); }
const pair = (x, y) => { return m => m(x, y); }

const slice = (items, start, end) => {
    function slice_iter(a, count) {
        return count === end ? null : pair(list_ref(a, count), slice_iter(a, count + 1));
    }
    return slice_iter(items, start);
}

const head = (items) => { return items === null ? null : items[0]; }
const tail = items => { return items === null || items.length === 0 ? null : items.slice(1); };

const list = (...items) => { return items; }
const last_pair = (items) => { return (items === null || items.length === 1) ? head(items) : last_pair(tail(items)); }

console.log(last_pair(list(23, 72, 149, 34)));
