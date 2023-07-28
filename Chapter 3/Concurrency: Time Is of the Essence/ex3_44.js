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

// ex 3.44
const transfer = (from_account, to_account, amount) => {
    from_account.withdraw(amount);
    to_account.deposit(amount);
}
/*
We do not need to use a more sophisicated method, such as the one required for dealing with the
exchange problem. So Louis is wrong.

The essential difference between the two problems is that the exchange problem requires that the
two accounts be locked at the same time, whereas the transfer problem does not.

Transfer problem -> lock the two accounts one at a time, and the order in which we lock them
does not matter.

Exchange problem -> lock the two accounts at the same time, and the order in
which we lock them does matter.
*/
