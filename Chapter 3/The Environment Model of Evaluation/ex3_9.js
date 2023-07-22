function sqaure(x) { return x * x; }
function sum_of_squares(x, y) { return sqaure(x) + sqaure(y); }
function f(a) { return sum_of_squares(a + 1, a * 2); }

function factorial(n) { return n === 1 ? 1 : n * factorial(n - 1); }
function factorial_iterative(n) { return fact_iter(1, 1, n); }
function fact_iter(product, counter, max_count) {
    return counter > max_count ? product : fact_iter(counter * product, counter + 1, max_count);
}

/*
ex. 3.9
Environment structures of of facotrial(6):

                 ^
        _________________
        | other var.    |
program | factorial :   |
env->   |_______________|
         |    |
         |    |
    variable : n
    body: n === 1 ? 1 : n * factorial(n - 1)

factorial(6)
         _______          ^
  E1 -->| n : 6 |_________| program env
         -------
        6 * factorial(5)
         _______          ^
  E2 -->| n : 5 |_________| program env
         -------
        5 * factorial(4)
         _______          ^
  E3 -->| n : 4 |_________| program env
         -------
        4 * factorial(3)
         _______          ^
  E4 -->| n : 3 |_________| program env
         -------
        3 * factorial(2)
         _______          ^
  E5 -->| n : 2 |_________| program env
         -------
        2 * factorial(1)
         _______          ^
  E6 -->| n : 1 |_________| program env
         -------
         1

Environment structures of of facotrial_iterative(6):
                        ^
        __________________________________
        | other var.                     |
        | factorial : *                  |
program | fact_iter : |               *  |
env ->  |_____________|_______________|__|
                      |   ^       |   ^
                      |   |       |   |
                      |   |   variables : product, counter, max_count
                      |   |   body:
                      |   |
                      |   |
                      |   |
                      |   |
                      |   |
                variable: n
                body: fact_iter(1,1 n)

factorial_iterative(6)
         _______              ^
  E1 -->| n : 6 |_____________| program env
         -------
         fact_iter(1, 1, n)

  E2 -->| product   : 1       ^
        | counter   : 1    ___| program env
        | max_count : 6
         fact_iter(1, 2, 6)

  E3 -->| product   : 1       ^
        | counter   : 2   ____| program env
        | max_count : 6
         fact_iter(2, 3, 6)

  E4 -->| product   : 2       ^
        | counter   : 3  _____| program env
        | max_count : 6
         fact_iter(6, 4, 6)

  E5 -->| product   : 6       ^
        | counter   : 4  _____| program env
        | max_count : 6
         fact_iter(24, 5, 6)

  E6 -->| product   : 24      ^
        | counter   : 5  _____| program env
        | max_count : 6
         fact_iter(120, 6, 6)

  E7 -->| product   : 120     ^
        | counter   : 6  _____| program env
        | max_count : 6
         fact_iter(720, 7, 6)

  E8 -->| product   : 720     ^
        | counter   : 7  _____| program env
        | max_count : 6
         720
*/
