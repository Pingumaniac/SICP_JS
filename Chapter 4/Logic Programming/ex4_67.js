/*
Part a.
related("son", "Adam", "Cain").
related("son", "Cain", "Enoch").
related("son", "Enoch", "Irad").
related("son", "Irad", "Mehujael").
related("son", "Mehujael", "Methushael").
related("son", "Methushael", "Lamech").
related("wife", "Lamech", "Ada").
related("son", "Ada", "Jabal").
related("son", "Ada", "Jubal").
related(["great", "grandson"], "Adam", "Irad").


Part b.
assert(rule(end_with_grandson($list), $list[$list.length - 1] === "grandson"));

Part c.
assert(rule(related(["great", $rel], $x, $y), and(end_with_grandson($rel), son($x, $temp),
related($rel, $temp, $y))));

d. Check your rules on queries such as related(["great", "grandson"], $g $ggs) and
related($relationship, ["Adam", "Irad").
*/
const end_with_grandson = arr => arr[arr.length - 1] === "grandson";
const find_great_grandson_relationship = (relations, rel, x) => {
    const match = relations.find(r => r.relationship.toString() === rel.toString() && r.from === x);
    if (match && end_with_grandson(rel)) {
        return relations.find(r => r.relationship === "son" && r.from === match.to);
    }
    return null;
};
const relations = [
    { relationship: "son", from: "Adam", to: "Cain" },
    { relationship: "son", from: "Cain", to: "Enoch" },
    { relationship: "son", from: "Enoch", to: "Irad" },
    { relationship: "son", from: "Irad", to: "Mehujael" },
    { relationship: "son", from: "Mehujael", to: "Methushael" },
    { relationship: "son", from: "Methushael", to: "Lamech" },
    { relationship: "wife", from: "Lamech", to: "Ada" },
    { relationship: "son", from: "Ada", to: "Jabal" },
    { relationship: "son", from: "Ada", to: "Jubal" },
    { relationship: ["great", "grandson"], from: "Adam", to: "Irad" },
];
const rel = ["great", "grandson"];
const x = "Adam";
const result = find_great_grandson_relationship(relations, rel, x);
console.log(result); // Output: { relationship: 'son', from: 'Irad', to: 'Mehujael' }

