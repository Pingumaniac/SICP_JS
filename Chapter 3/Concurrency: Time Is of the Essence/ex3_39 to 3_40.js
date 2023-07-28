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
        withdraw: function(amount) {
            return protect(() => withdraw(amount));
        },
        deposit: function(amount) {
            return protect(() => deposit(amount));
        },
        balance: function() {
            return balance;
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

// ex 3.39
const concurrent_execute = (...functions) => {
    return Promise.all(functions.map(f => new Promise(resolve => resolve(f))));
}

let x = 10;
const s = make_serializer();
concurrent_execute( () => { x = s(() => x * x)(); }, s(() => { x = x + 1; }) );
// (x*x then x+1) 101
// (x+1 then x*x) 121
// (x*x the x+1 but x*x ignored when x+1 is made) 11
// (x+1 then x*x but x+1 ignored when x*x is made) 100
// (x*x but obtained different values of x: 10, 11) 110

// ex 3.40
x = 10;
concurrent_execute( () => { x = x * x; }, () => { x = x * x * x; } );
concurrent_execute( s(() => { x = x * x; }), s(() => { x = x * x * x; }));
// all possible values: 100, 1000, 10000, 100000, 1000000
// one remaining value after serialised: 1000000
