/*

f("x", "y") -> all save and restore operations are superfluous
f()("x", "y") -> all save and restore operations are superfluous
f(g("x"), "y") -> all save and restore operations are not superfluous
f()(g("x"), "y") -> all save and restore operations are not superfluous

*/
