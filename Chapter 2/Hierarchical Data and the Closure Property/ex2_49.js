function Pair(left, right) { this.left = left; this.right = right; }
const head = (items) => { return items === null || items === undefined ? null : items.left; }
const tail = (items) => { return items === null || items === undefined ? null : items.right; }
const list = (...items) => { return items.length === 0 ? null : new Pair(items[0], list(...items.slice(1))); }
const for_each = (f, list) => { return list === null ? null : new Pair(f(head(list)), for_each(f, tail(list))); }
const pair = (x, y) => { return new Pair(x, y); }
const is_pair = (x) => { return x instanceof Pair; }
const make_mobile = (left, right) => { return pair(left, right); }
const make_branch = (length, structure) => { return pair(length, structure); }
const left_branch = (mobile) => { return head(mobile); }
const right_branch = (mobile) => { return tail(mobile); }
const branch_length = (branch) => { return head(branch); }
const branch_structure =(branch) => { return tail(branch); }
const total_weight = (mobile) => { return branch_weight(left_branch(mobile)) + branch_weight(right_branch(mobile));}
const branch_weight = (branch) => { return is_mobile(branch) ? total_weight(branch) : branch_length(branch); }
const is_mobile = (structure) => { return !(head(structure) instanceof Pair) && !(tail(structure) instanceof Pair); }
const is_balanced = (mobile) => { return branch_torque(left_branch(mobile)) === branch_torque(right_branch(mobile)); }
const branch_torque = (branch) => { return branch_length(branch) * branch_weight(branch); }
// const reverse = (items) => { return items === null ? null : append(reverse(tail(items)), list(head(items))); }
// const count_leaves = (x) => { return x === null ? 0 : (x instanceof Pair ? count_leaves(head(x)) + count_leaves(tail(x)) : 1); }
// const map = (f, items) => { return items === null ? null : new Pair(f(head(items)), map(f, tail(items))); }
// const append = (list1, list2) => { return list1 === null ? list2 : new Pair(head(list1), append(tail(list1), list2)); }
const map = (f, sequence) => { return accumulate((x, y) => pair(f(x), y), null, sequence); }
const append = (seq1, seq2) => { return accumulate(pair, seq2, seq1); }
const length = (sequence) => { return accumulate((x, y) => y + 1, 0, sequence); }
const enumerate_interval = (low, high) => { return low > high ? null : pair(low, enumerate_interval(low + 1, high)) }
const count_leaves = (t) => { return accumulate((x, y) => x + y, 0, map(x => 1, fringe(t))); }
const plus = (x, y) => { return x + y; }
const minus = (x, y) => { return x - y; }
const times = (x, y) => { return x * y; }
const divide = (x, y) => { return y === 0 ? Infinity : x / y; };
const dot_product = (v, w) => { return accumulate(plus, 0, accumulate_n(times, 1, list(v, w))); }
const matrix_times_vector = (m , v) => { return map(row => dot_product(row, v), m); }
const transpose = (m) => { return accumulate_n(pair, null, m); }
const matrix_times_matrix = (m1, m2) => { return map(row => matrix_times_vector(transpose(m2), row), m1); }
const reverse = (sequence) => { return fold_left((x, y) => pair(y, x), null, sequence); }
const reverse_right = (sequence) => { return fold_right((x, y) => append(y, list(x)), null, sequence); }

const print_list = (list) => {
    if (list === null) {
        return '';
    } else if (head(list) instanceof Pair) {
        return '(' + print_list(head(list)) + ') ' + print_list(tail(list));
    } else {
        return head(list) + ' ' + print_list(tail(list));
    }
};
const deep_reverse = (items) => {
    if (items === null) {
        return null;
    } else {
        const headItems = (head(items) instanceof Pair) ? deep_reverse(head(items)) : head(items);
        return append(deep_reverse(tail(items)), list(headItems));
    }
};
const fringe = (items) => {
    if (items === null) {
        return null;
    } else if (head(items) instanceof Pair) {
        return append(fringe(head(items)), fringe(tail(items)));
    } else {
        return new Pair(head(items), fringe(tail(items)));
    }
};
const scale_tree = (tree, factor) => {
    return tree === null ? null : pair(scale_tree(head(tree), factor), scale_tree(tail(tree), factor));
}
const scale_tree_map = (tree, factor) => {
    return map(sub_tree => is_pair(sub_tree) ? scale_tree_map(sub_tree, factor) : sub_tree * factor, tree);
}
const square_tree = (tree) => {
    if (tree === null) {
        return null;
    } else if (head(tree) instanceof Pair) {
        return new Pair(square_tree(head(tree)), square_tree(tail(tree)));
    } else {
        return new Pair(head(tree) * head(tree), square_tree(tail(tree)));
    }
};
const square_tree_map = (tree) => {
    return map(sub_tree => sub_tree instanceof Pair ? square_tree_map(sub_tree) : sub_tree * sub_tree, tree);
}
const subset = (s) => {
    if (s === null) {
        return list(null);
    } else {
        const rest = subset(tail(s));
        return append(rest, map(x => pair(head(s), x), rest));
    }
}
const filter = (predicate, sequence) => {
    return sequence === null ? null : predicate(head(sequence)) ? pair(head(sequence), filter(predicate, tail(sequence))) : filter(predicate, tail(sequence));
}
const accumulate = (op, initial, sequence) => {
    return sequence === null ? initial : op(head(sequence), accumulate(op, initial, tail(sequence)));
}
const enumerate_tree = (tree) => {
    return tree === null ? null : ! is_pair(tree) ? list(tree) : append(enumerate_tree(head(tree)), enumerate_tree(tail(tree)));
}
const horder_eval = (x, coefficient_sequence) => {
    return accumulate((this_coeff, higher_terms) => x * higher_terms + this_coeff, 0, coefficient_sequence);
}
const accumulate_n = (op, initial, seqs) => {
    return seqs === null ? initial : pair(accumulate(op, initial, map(head, seqs)), accumulate_n(op, initial, map(tail, seqs)));
}
const fold_right = (op, initial, sequence) => {
    return sequence === null ? initial : op(initial, fold_right(op, head(sequence), tail(sequence)));
};
const fold_left = (op, initial, sequence) => {
    const iter = (result, rest) => {
        return rest === null ? result : iter(op(result, head(rest)), tail(rest));
    }
    return iter(initial, sequence);
};
const flat_map = (f, seq) => { return accumulate(append, null, map(f, seq)); }
const permutations = (s) => {
    return s === null ? list(null) : flat_map(x => map(p => pair(x, p), permutations(remove(x, s))), s);
}
const remove = (item, sequence) => {
    return sequence === null ? null : item === head(sequence) ? tail(sequence) : pair(head(sequence), remove(item, tail(sequence)));
}

function corner_split(painter, n) {
    if (n === 0) {
        return painter;
    } else {
        const up = up_split(painter, n - 1);
        const right = right_split(painter, n - 1);
        const top_left = beside(up, up);
        const bottom_right = below(right, right);
        const corner = corner_split(painter, n - 1);
        return beside(below(painter, top_left), below(bottom_right, corner));
    }
}
function square_of_four(tl, tr, bl, br) {
    return (painter) => {
        const top = beside(tl(painter), tr(painter));
        const bottom = beside(bl(painter), br(painter));
        return below(bottom, top);
    }
}
function flipped_pairs(painter) {
    const combine4 = square_of_four(identity, flip_vert, identity, flip_vert);
    return combine4(painter);
}
function square_limit(painter, n) {
    const combine4 = square_of_four(flip_horiz, identity, rotate180, flip_vert);
    return combine4(painter);
}
const right_split = split(beside, below);
const up_split = split(below, beside);
const split = (join, next) => {
    return (painter, n) => {
        if (n === 0) {
            return painter;
        } else {
            const smaller = next(painter, n - 1);
            return join(painter, beside(smaller, smaller));
        }
    }
}
function frame_coord_map(frame) {
    return (v) => add_vect(origin_frame(frame), scale_vect(xcor_vect(v), frame_edge1(frame), scale_vect(ycor_vect(v), frame_edge2(frame))));
}
const xcor_vect = (v) => head(v);
const ycor_vect = (v) => tail(v);
const make_vect = (x, y) => list(x, y);
const add_vect = (v1, v2) => make_vect(head(v1) + head(v2), tail(v1) + tail(v2));
const sub_vect = (v1, v2) => make_vect(head(v1) - head(v2), tail(v1) - tail(v2));
const scale_vect = (s, v) => make_vect(s * head(v), s * tail(v));

function make_frame(origin, edge1, edge2) {
    return list(origin, edge1, edge2);
}
function make_frame2(origin, edge1, edge2) {
    return pair(origin, pair(edge1, edge2));
}

// for each constructor supply the appripriate selectors to produce an implementation for frames
const origin_frame = (frame) => head(frame);
const edge1_frame = (frame) => head(tail(frame));
const edge2_frame = (frame) => tail(tail(frame));

function segments_to_painter(segment_list) {
    return (frame) => {
        for_each(segment => draw_line(frame_coord_map(frame)(start_segment(segment)), frame_coord_map(frame)(end_segment(segment))), segment_list);
    }
}

const make_segment = (start, end) => list(start, end);
const start_segment = (segment) => head(segment);
const end_segment = (segment) => tail(segment);

// ex 2.49
// (a) the painter that draws the outline of the designated frame
const outline_frame = (frame) => {
    const segments = list(make_segment(origin_frame(frame), edge1_frame(frame)),
                          make_segment(edge1_frame(frame), add_vect(edge1_frame(frame), edge2_frame(frame))),
                          make_segment(add_vect(edge1_frame(frame), edge2_frame(frame)), add_vect(origin_frame(frame), edge2_frame(frame))),
                          make_segment(add_vect(origin_frame(frame), edge2_frame(frame)), origin_frame(frame)));
    return segments_to_painter(segments);
}

// (b) the painter that draws an "X" by connecting opposite corners of the frame
const x_frame = (frame) => {
    const segments = list(make_segment(origin_frame(frame), add_vect(origin_frame(frame), edge2_frame(frame))),
                          make_segment(add_vect(origin_frame(frame), edge1_frame(frame)), add_vect(origin_frame(frame), edge2_frame(frame))));
    return segments_to_painter(segments);
}

// (c) the painter that draws a diamond shape by connecting the midpoints of the sides of the frame
const diamond_frame = (frame) => {
    const segments = list(make_segment(add_vect(origin_frame(frame), scale_vect(1/2, edge1_frame(frame))), add_vect(origin_frame(frame), scale_vect(1/2, edge2_frame(frame)))),
                          make_segment(add_vect(origin_frame(frame), scale_vect(1/2, edge2_frame(frame))), add_vect(origin_frame(frame), scale_vect(1/2, edge1_frame(frame)))),
                          make_segment(add_vect(origin_frame(frame), scale_vect(1/2, edge1_frame(frame))), add_vect(origin_frame(frame), scale_vect(1/2, edge2_frame(frame)))),
                          make_segment(add_vect(origin_frame(frame), scale_vect(1/2, edge2_frame(frame))), add_vect(origin_frame(frame), scale_vect(1/2, edge1_frame(frame)))));
    return segments_to_painter(segments);
}

// (d) the wave painter
const wave = (frame) => {
    const segments = list(make_segment(add_vect(origin_frame(frame), scale_vect(1/2, edge1_frame(frame))), add_vect(origin_frame(frame), scale_vect(1/4, edge2_frame(frame)))),
                          make_segment(add_vect(origin_frame(frame), scale_vect(1/4, edge2_frame(frame))), add_vect(origin_frame(frame), scale_vect(3/4, edge2_frame(frame)))),
                          make_segment(add_vect(origin_frame(frame), scale_vect(3/4, edge2_frame(frame))), add_vect(origin_frame(frame), scale_vect(1/2, edge1_frame(frame)))));
    return segments_to_painter(segments);
}
