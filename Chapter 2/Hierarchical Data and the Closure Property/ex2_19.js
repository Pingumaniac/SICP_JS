function Pair(left, right) {
    this.left = left;
    this.right = right;
}

const head = (items) => { return items === null ? null : items.left; }
const tail = (items) => { return items === null ? null : items.right; }
const list = (...items) => { return items.length === 0 ? null : new Pair(items[0], list(...items.slice(1))); }
const append = (list1, list2) => { return list1 === null ? list2 : new Pair(head(list1), append(tail(list1), list2)); }
const reverse = (items) => { return items === null ? null : append(reverse(tail(items)), list(head(items))); }
const printList = (list) => { return list === null ? '' : head(list) + ' ' + printList(tail(list)); }

const us_coins = list(50, 25, 10, 5, 1);
const uk_coins = list(100, 50, 20, 10, 5, 2, 1);

function cc(amount, coin_values) {
    return amount === 0 ? 1 : amount < 0 || no_more(coin_values) ? 0 : cc(amount, except_first_denomination(coin_values)) + cc(amount - first_denomination(coin_values), coin_values);
}

const first_denomination = (coin_values) => { return head(coin_values); }
const except_first_denomination = (coin_values) => { return tail(coin_values); }
const no_more = (coin_values) => { return coin_values === null; }

console.log(cc(100, us_coins));
/*
The order of the list coin_values does not matter,
because the except_first_denomination procedure will always return a list with the same elements,
but in a different order.
*/
