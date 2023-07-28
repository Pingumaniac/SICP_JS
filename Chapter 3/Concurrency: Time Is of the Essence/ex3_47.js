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

// ex 3.47a, semaphore using make_mutex
const make_semaphore = (n) => {
    const mutex = make_mutex();
    const count = n;
    return {
        acquire: function () {
            mutex("acquire");
            if (count > 0) {
                count = count - 1;
                mutex("release");
            } else {
                mutex("release");
                acquire();
            }
        },
        release: function () {
            mutex("acquire");
            count = count + 1;
            mutex("release");
        }
    }
}

// ex 3.47b, semaphore using make_serializer
const make_semaphore_2 = (n) => {
    const s = make_serializer();
    const count = n;
    return {
        acquire: function () { s(() => { return count > 0 ? count = count - 1 : acquire(); })(); },
        release: function () { count = count + 1; }
    }
}
