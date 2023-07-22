let balance = 100;

const make_monitored = f => {
    let count = 0;
    return mf = args => {
        if (args === "how many calls") {
            return count;
        } else if (args === 'reset count') {
            count = 0;
            return count;
        } else {
            count = count + 1;
            return f(args);
        }
    }
}

const make_account = (balance, password) => {
    this.count = 0;
    const withdraw = amount => {
        if (balance >= amount) {
            balance = balance - amount;
            return balance;
        } else {
            return "Insufficient funds";
        }
    }
    const deposit = amount => {
        balance = balance + amount;
        return balance;
    }
    const dispatch = (m, amount, pass) => {
        if (pass === password) {
            return m === "withdraw" ? withdraw(amount) : m === "deposit" ? deposit(amount) : "Unknown request -- make_account";
        } else {
            this.count = this.count + 1;
            return this.count >= 7 ? call_the_cops : "Wrong password";
            return "Wrong password";
        }
    }
    const call_the_cops = () => {
        return "call the cops";
    }
    return dispatch;
}

// ex 3.10
const make_withdraw = balance => {
    return amount => {
        if (balance >= amount) {
            balance = balance - amount;
            return balance;
        } else {
            return "Insufficient funds";
        }
    }
}

const W1 = make_withdraw(100);
/*
W1 => defined in the global env
=> bound to the result of make_withdraw(100), which is a lambda function.
Balance = 100.
*/
W1(50);
/*
Balance becomes 50.
*/
const W2 = make_withdraw(100);
/*
W2 => defined in the global env
=> bound to the result of make_withdraw(100), which is a lambda function.
Balance = 100.

W1 and W2 are independent of each other. W1 and W2 can have different balances.
*/
