/*
Factorial simulation (input = 3):

Step 1:
- n = 3
- product = 1
- t = undefined

Step 2:
- n = 2
- product = 3
- t = 3

Step 3:
- n = 1
- product = 6
- t = 2

Step 4:
- n = 0
- product = 6
- t = 1

Step 5:
- output = 6

Fibonacci function simulation (input = 3):

Step 1:
- n = 3
- Stack: empty
- As n < 2 is false, save("continue") and set it to afterfib_n_1.

Step 2:
- n = 2 (1st recursive call for Fib(2))
- Stack: fib_done, 3
- As n < 2 is false, save("continue") and n, then decrement n.

Step 3:
- n = 1 (2nd recursive call for Fib(1))
- Stack: fib_done, 3, afterfib_n_1, 2
- As n < 2 is true, then go to immediate_answer and set val = 1.

Step 4:
- n = 2 (back to computation for Fib(2))
- Stack: fib_done, 3, afterfib_n_1
- Restore n, continue, n = n - 2, save continue, save val = 1.

Step 5:
- n = 0 (third recursive call for Fib(0))
- Stack: fib_done, 3, afterfib_n_1, afterfib_n_2, 1
- As n < 2 us true, go to immediate_answer and set val = 0.

Step 6:
- n = 1, val = 1 (back to computation for Fib(3))
- Stack: fib_done, 3
- Restore val = 1, restore continue, val = val + n = 1 + 1 = 2.

Step 7:
- Result = 2
- Stack: empty
*/
