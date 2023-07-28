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
const serialized_exchange = (account1, account2) => {
    const serializer1 = account1.balance_serializer();
    const serializer2 = account2.balance_serializer();
    serializer1(serializer2(exchange))(account1, account2);
}

/*
the balances in three accounts start out as 10, 20, and 30.

if multiple threads run sequentially, after any number of concurrent exchanges, the account balances should
be 10, 20, and 30.

but this condition can be violated if the exchanges are implemented using original exchange function.
for example, if two threads run the following code concurrently:
    exchange(account1, account2);
    exchange(account2, account3);
    exchange(account3, account1);
then the balances in the three accounts will be 0, 60, and 0.

steps of the execution:
    thread 1: account1.withdraw(10);
    thread 2: account2.withdraw(20);
    thread 1: account2.deposit(10);
    thread 2: account1.deposit(20);

    thread 1: account2.withdraw(10);
    thread 2: account3.withdraw(30);
    thread 1: account3.deposit(10);
    thread 2: account2.deposit(30);

    thread 1: account3.withdraw(10);
    thread 2: account1.withdraw(20);
    thread 1: account1.deposit(10);
    thread 2: account3.deposit(20);

But the total amount of money in the system is still conserved (= 60).
*/
