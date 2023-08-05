const amb = (...choices) => choices;
function require(p) { if (!p) { amb(); } else { } }
function is_safe(board, row, col) {
    for (let i = 0; i < row; i++) {
        if (board[i] === col || Math.abs(board[i] - col) === Math.abs(i - row)) {
            return false;
        }
    }
    return true;
}
function solve(board, row) {
    if (row === 8) {
        print_board(board);
        return;
    }
    for (let col of amb(...Array(8).keys())) {
        if (is_safe(board, row, col)) {
            board[row] = col;
            solve(board, row + 1);
        }
    }
}
function print_board(board) {
    board.forEach(row => {
        console.log(Array(8).fill('.').map((_, col) => (col === row ? 'Q' : '.')).join(' '));
    });
    console.log('\n');
}
const board = Array(8).fill(null);
solve(board, 0);

