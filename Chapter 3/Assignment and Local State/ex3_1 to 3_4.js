let balance = 100;

function make_withdraw(balance) {
    return amount => {
        if (balance >= amount) {
            balance = balance - amount;
            return balance;
        } else {
            return "Insufficient funds";
        }
    }
}

// ex. 3.1
const make_accumulator = (n) => { let sum = n; return x => { sum += x; return sum; } }

const a = make_accumulator(5);
console.log(a(10));
console.log(a(10));
// end of ex 3.1

// ex. 3.2
const make_monitored = (f) => {
    let count = 0;
    return mf = (args) => {
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

const s = make_monitored(Math.sqrt);
console.log(s(100));
console.log("how many calls");
// end of ex 3.2

// ex. 3.3 and ex. 3.4
const make_account = (balance, password) => {
    this.count = 0;
    const withdraw = (amount) => {
        if (balance >= amount) {
            balance = balance - amount;
            return balance;
        } else {
            return "Insufficient funds";
        }
    }
    const deposit = (amount) => {
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

const acc = make_account(100, "secret password");
console.log(acc("withdraw", 40, "secret password"));
console.log(acc("deposit", 40, "secret password"));
console.log(acc("withdraw", 40, "secret password"));
// end of ex 3.3

console.log(acc("withdraw", 10, "hannah"));
console.log(acc("withdraw", 10, "dull"));
console.log(acc("withdraw", 10, "set"));
console.log(acc("withdraw", 10, "net"));
console.log(acc("withdraw", 10, "daseot"));
console.log(acc("withdraw", 10, "yeoseot"));
console.log(acc("withdraw", 10, "ilgop"));
// end of ex 3.4
