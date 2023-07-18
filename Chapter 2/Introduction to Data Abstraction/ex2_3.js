function pair(x, y) {
    return [x, y];
}

function head(z) { return z[0]; }
function tail(z) { return z[1]; }

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


const rectangle = (p1, p2, p3, p4) => {
    const side1 = make_segment(p1, p2);
    const side2 = make_segment(p2, p3);
    const side3 = make_segment(p3, p4);
    const side4 = make_segment(p4, p1);
    return pair(side1, pair(side2, pair(side3, side4)));
}

const area = rect => {
    const side1 = head(rect);
    const side2 = head(tail(rect));
    return length_segment(side1) * length_segment(side2);
}

const length_segment = s => {
    const start = start_segment(s);
    const end = end_segment(s);
    return Math.sqrt(Math.pow(x_point(start) - x_point(end), 2) + Math.pow(y_point(start) - y_point(end), 2));
}

const perimeter = rect => {
    const side1 = head(rect);
    const side2 = head(tail(rect));
    return 2 * (length_segment(side1) + length_segment(side2));
}


test = rectangle(make_point(1, 1), make_point(1, 2), make_point(3, 1), make_point(3, 2));
console.log(area(test));
console.log(perimeter(test));
