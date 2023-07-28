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
/*
"It is a waste of time to create a new serialised function in response to every withdraw and deposit request.
It can be changed so that the calls to protect are moved to the withdraw and deposit functions.
That is, an account would return the same serialized function (which was created at the same time as the account)
each time it is asked for a withdrawal function."

This is a safe change to make because the serialised function is returned each time.
There isn't much difference in a way that concurrency is allowed by these two versions.
*/

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
