let balance = 100;
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

function make_simplified_withdraw(balance) {
    return amount => {
        balance = balance - amount;
        return balance;
    }
}
const W = make_simplified_withdraw(25);
console.log(W(20));
console.log(W(10));
function make_decrementer(balance) {
    return amount => balance - amount;
}
const D = make_decrementer(25);
console.log(D(20));
console.log(D(10));
const D1 = make_decrementer(25);
const D2 = make_decrementer(25);
const W1 = make_simplified_withdraw(25);
const W2 = make_simplified_withdraw(25);
console.log(W1(20));
console.log(W1(20));
console.log(W2(20));

// ex 3.7
const make_joint = (password_protected_account, password, new_password) => {
    const new_account = (m, amount, pass) => {
        if (pass === new_password) {
            return m === "withdraw" ? withdraw(amount) : m === "deposit" ? deposit(amount) : "Unknown request -- make_account";
        } else {
            return password_protected_account(m, amount, pass === password ? new_password : pass);
        }
    }
    return new_account;
}

const peter_acc = make_account(100, "open sesame");
const paul_acc = make_account(peter_acc, "open sesame", "rosebud");
// end of ex 3.7

// ex 3.8
const f = x => {
    return x === 0 ? 0 : f(x - 1) + x;
}
console.log(f(0) + f(1));
console.log(f(1) + f(0));
// end of ex 3.8
