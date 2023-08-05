const check_valid_order = order => {
    const alyssa_statement = (order['Lem'] === 2 && order['Alyssa'] === 3) || (order['Lem'] !== 2 && order['Alyssa'] !== 3);
    const cy_statement = (order['Cy'] === 1 && order['Eva'] === 2) || (order['Cy'] !== 1 && order['Eva'] !== 2);
    const eva_statement = (order['Eva'] === 3 && order['Cy'] === 5) || (order['Eva'] !== 3 && order['Cy'] !== 5);
    const lem_statement = (order['Lem'] === 2 && order['Louis'] === 4) || (order['Lem'] !== 2 && order['Louis'] !== 4);
    const louis_statement = (order['Louis'] === 4 && order['Alyssa'] === 1) || (order['Louis'] !== 4 && order['Alyssa'] !== 1);
    return [alyssa_statement, cy_statement, eva_statement, lem_statement, louis_statement].filter(Boolean).length === 5;
}
const solve = () => {
    const names = ['Alyssa', 'Cy', 'Eva', 'Lem', 'Louis'];
    for (let alyssa = 1; alyssa <= 5; alyssa++) {
        for (let cy = 1; cy <= 5; cy++) {
            if (cy === alyssa) { continue };
            for (let eva = 1; eva <= 5; eva++) {
                if (eva === alyssa || eva === cy) { continue };
                for (let lem= 1; lem <= 5; lem++) {
                    if (lem === alyssa || lem === cy || lem === eva) { continue };
                    for (let louis = 1; louis <= 5; louis++) {
                        if (louis === alyssa || louis === cy || louis === eva || louis === lem) { continue };
                        const order = { Alyssa: alyssa, Cy: cy, Eva: eva, Lem: lem, Louis: louis };
                        if (check_valid_order(order)) {
                            console.log(order);
                            return;
                        }
                    }
                }
            }
        }
    }
}
solve(); // { Alyssa: 2, Cy: 3, Eva: 1, Lem: 4, Louis: 5 }
