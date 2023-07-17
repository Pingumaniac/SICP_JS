function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}


/*
Solution: Check below to see the number of remainder operations for gcd(206, 40) for normal order evaluation rule.

Step 1 -> gcd(206, 40)
-> gcd(40, 206 % 40)

Step 2 -> gcd(40, 206 % 40)
-> gcd(206 % 40, 40 % (206 % 40))

Step 3 -> gcd(206 % 40, 40 % (206 % 40))
-> gcd(40 % (206 % 40), (206 % 40) % (40 % (206 % 40)))

Step 4 -> gcd(40 % (206 % 40), (206 % 40) % (40 % (206 % 40)))
-> (206 % 40) % (40 % (206 % 40)) = 2

Step 5 -> gcd(206 % 40) % (40 % (206 % 40)), (40 % (206 % 40)) % (206 % (40 % (206 % 40)))
-> (40 % (206 % 40)) % (206 % (40 % (206 % 40))) = 0

Step 6 -> gcd(206 % 40) % (40 % (206 % 40)), 0)
-> (206 % 40) % (40 % (206 % 40)) = 2


Performs 4 remainder operations for gcd(206, 40) for applicative order evaluation rule.
gcd(206, 40)
-> gcd(40, 206 % 40)
-> gcd(40, 6)
-> gcd(6, 40 % 6)
-> gcd(6, 4)
-> gcd(4, 6 % 4)
-> gcd(4, 2)
-> gcd(2, 4 % 2)
-> gcd(2, 0)
-> 2
*/
