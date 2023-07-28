function make_account(balance) {
    function withdraw(amount) {
        if (balance >= amount) {
            balance = balance - amount;
            return balance;
        } else {
            return "Insufficient funds";
        }
    }
    function deposit(amount) {
        balance = balance + amount;
        return balance;
    }
    const protect = make_serializer();
    const protected_withdraw = protect(withdraw);
    const protected_deposit = protect(deposit);
    return {
        withdraw: function(anmount) {
            return protected_withdraw(amount);
        },
        deposit: function(amount) {
            return protected_deposit(amount);
        },
        balance: function() {
            protect(() => balance)(undefined); // serialised
        }
    }
}
const make_serializer = () => {
    const mutex = make_mutex();
    return f => {
        function serialised_f(...args) {
            mutex("acquire");
            const val = f(...args);
            mutex("release");
            return val;
        }
        return serialised_f;
    }
}
const make_mutex = () => {
    const cell = [false];
    function the_mutex(m) {
        if (m === "acquire") {
            test_and_set(cell);
            return the_mutex("acquire");
        } else if (m === "release") {
            test_and_set(cell);
            return the_mutex("release");
        }
    }
}
const test_and_set = cell => {
    if (cell[0]) {
        return true;
    }
    if (cell[0] === false) {
        cell[0] = true;
        return false;
    }
}
const exchange = (account1, account2) => {
    const difference = account1.balance() - account2.balance();
    account1.withdraw(difference);
    account2.deposit(difference);
}
const make_account_and_serializer = (balance) => {
    const balance_serializer = make_serializer();
    return {
        withdraw: function(amount) {
            if (balance > amount) {
                balance = balance - amount;
                return balance;
            } else {
                return "Insufficient funds";
            }
        },
        deposit: function(amount) {
            balance = balance + amount;
            return balance;
        },
        balance: function() {
            return balance;
        },
        balance_serializer: function() {
            return balance_serializer;
        },
    }
}
const deposit = (account, amount) => {
    const s = account.balance_serializer();
    const d = account.deposit;
    s(d)(amount);
}
/*
"One way to avoid the deadlock in this situation is to give each account a unique id number and rewrite
serialized_exchange so that a thread will always attempt to enter a function protecting the lowest-numbered
account first. Although this method works well for the exchange problem, there are other situations that
require more sophisticated deadlock-avoidance techniques, or where deadlock cannot be avoided at all."

ex 3.48

i.e. the accounts are numbered, and each thread attempts to acquire the smaller-numbered account first.
-> this avoids deadlock in the exchnge problem, because the thread that acquires the smaller-numbered account
will always be able to acquire the larger-numbered account, but not vice versa.

the new serialized_exchange function would be:
*/
const serialized_exchange = (account1, account2) => {
    const smaller = account1.balance() < account2.balance() ? account1 : account2;
    const larger = account1.balance() < account2.balance() ? account2 : account1;
    const smaller_serializer = smaller.balance_serializer();
    const larger_serializer = larger.balance_serializer();
    smaller_serializer(() => {
        larger_serializer(() => {
            const difference = smaller.balance() - larger.balance();
            smaller.withdraw(difference);
            larger.deposit(difference);
        })(undefined);
    })(undefined);
}
/*
ex. 3.49

Thus, in the exchange problem, each thread knows in advance which accounts it will need to get access to.
In a situation where a thread must get access to some shared resources before it can know which additional
shared resources it will acquire, a "resource-allocation graph" is needed. In this case, the threads
must be able to detect when a cycle exists in the resource-allocation graph, and then abort the
transaction and try again later.
*/
