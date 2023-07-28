function withdraw(amount) {
    if (balance >= amount) {
        balance = balance - amount;
        return balance;
    } else {
        return "Insufficient funds";
    }
}

// ex 3.38
// const joint_ank_account = make_account(100);
// peter deposits 10
// paul withdraws 20
// mary withdraws have of the money

/*
Possible values:

1. Peter, Paul, then Mary: 45
2. Peter, Mary, then Paul: 35
3. Paul, Peter, then Mary: 45
4. Paul, Mary, then Peter: 50
5. Mary, Peter, then Paul: 40
6. Mary, Paul, then Peter: 40

The other values that could be produced if the system allows the threads to be interleaved are,
for instance, 35 and 65.

because
peter's operation is balance = balance + 10
paul's operation is balance = balance - 20
mary's operation is balance = balance - (balance / 2)

but the time when the balance is read is different for each thread, so the result can vary even more.

for instance,
after peter's operation, the balance is 110
after paul's operation, the balance is 90
but mary can read the balance for 110 and 90 at different times and calculate final result

e.g. balance = 110 - (90 / 2) = 65
or
balance = 90 - (110 / 2) = 35

timing diagram:
peter: 100 -> 110
paul: 110 -> 90
mary: 110 or 90 -> 65 or 35
*/
