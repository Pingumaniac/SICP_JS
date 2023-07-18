function pair(x, y) {
    function dispatch(m) {
        return m === 0 ? x : m === 1 ? y : error(m, "Argument not 0 or 1 -- pair");
    }
    return dispatch;
}

function head(z) { return z(0); }
function tail(z) { return z(1); }


function print_point(p) {
    console.log("(" + x_point(p).toString() + ", " + y_point(p).toString() + ")");
}

const make_point = (x, y) => pair(x, y);
const x_point = p => head(p);
const y_point = p => tail(p);

const make_segment = (start_point, end_point) => pair(start_point, end_point);
const start_segment = s => head(s);
const end_segment = s => tail(s);

const mid_point_segment = s => {
    const start = start_segment(s);
    const end = end_segment(s);
    return make_point((x_point(start) + x_point(end)) / 2,
                      (y_point(start) + y_point(end)) / 2);
}



test = make_segment(make_point(1, 2), make_point(3, 4));
print_point(mid_point_segment(test)); // returns (2, 3)
