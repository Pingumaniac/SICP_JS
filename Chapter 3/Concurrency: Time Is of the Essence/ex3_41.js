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
    return {
        withdraw: function(anmount) {
            return protect(() => withdraw(amount));
        },
        deposit: function(amount) {
            return protect(() => deposit(amount));
        },
        balance: function() {
            protect(() => balance)(undefined); // serialised
        }
    }
}
/*
Allowing unserialized access to the bank balance can result in anomalous behaviour.
For example, if two processes try to withdraw money at the same time, the balance
could be negative. This is because the two processes could read the balance simultaneously,
and then both processes could withdraw money before the balance is updated.
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
