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

function sqrt(x) {
    function is_good_enough(guess) {
        return Math.abs(guess * guess - x) < 0.001;
    }
    function improve(guess) {
        return average(guess, x / guess);
    }
    function sqrt_iter(guess) {
        return is_good_enough(guess) ? guess : sqrt_iter(improve(guess));
    }
    return sqrt_iter(1.0);
}

const acc = make_account(50);
/*
acc => defined in the global env
=> bound to the result of make_account(50), which is a lambda function.
=> balance = 50
*/
console.log(acc("deposit", 40));
// balance = 50 + 40 = 90
console.log(acc("withdraw", 60));
// balance = 90 - 60 = 30
const acc2 = make_account(100);
/*
acc2 => defined in the global env
=> bound to the result of make_account(100), which is a lambda function.
=> balance = 100

local states for the two accounts kept distict, because they are bound to different lambda functions of same type.
the environment structure that are shared between acc and acc2 is the global env.
*/
