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
/*
why this test_and_set function will fail

Demonstration of how the mutex implementation can fail by allowing two threads to acquire the mutex
simultaneously.

The test_and_set function is supposed to return true if the mutex is already acquired, and false if
it is not.

However, if two threads call test_and_set simultaneously, they will both see that
cell[0] is false, and both will set it to true. This means that both threads will think they have
acquired the mutex, and both will proceed to execute the critical section.
*/
