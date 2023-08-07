/*
ex 4.53
let ex53_part_a = supervisor($person, ["Bitdiddle", "Ben"]);
let ex53_part_b = job($person, ["accounting", $work]);
let ex53_part_c = address($person, ["Slumerville", $address]);

ex 4.54
let ex54_part_a = and(supervisor($person, ["Bitdiddle", "Ben"]), address($person, $where));
let ex54_part_b = and(salary(["Bitdiddle", "Ben"], $number), salary($person, $amount),
                    javascript_predicate($amount < $number));
let ex54_part_c = and(supervisor($person, $boss), not(job($boss, ["computer", $type])),
                    job($boss, $job));

ex 4.55
let ex55_rule = rule(can_replace($person1 $person2),
                and(job($person1 $job1),
                or(job($person2 $job1),
                and(job($person2 $job2),
                can_do_job($job1 $job2))),
                not(same($person1 $person2))));

let ex55_part_a = can_replace($person, ["Fect", "Cy", "D"]);
let ex55_part_b = and(can_replace($person1, $person2),
                    salary($person1, $salary1),
                    salary($person2, $salary2),
                    javascript_predicate($salary1 < $salary2));

ex 4.56
rule(bigshot($person, $division),
    and(job($person, [$division, $person_rest_info]),
        not(and(supervisor($person, $boss),
            job($boss, [$division, $boss_rest_info])))));


ex 4.57
let meeting1 = meeting("accounting", ["Monday" "9am"]);
let meeting2 = meeting("administration", ["Monday" "10pm"]);
let meeting3 = meeting("computer", ["Wednesday", "3pm"]);
let meeting4 = meeting("administration", ["Friday", "1pm"]);
let whole_company_meeting = meeting("whole-company", ["Wednesday", "4pm"]);

let ex57_part_a = meeting($division, ["Friday", $time]);
let ex57_part_b = rule(meeting_time($person, $day_and_time),
                    or(meeting($division, $day_and_time),
                        and(employee($person, $division), meeting($division, $day_and_time)),
                            meeting("whole-company", $day_and_time)));

let ex57_part_c = meeting_time("Alyssa", ["Wednesday", $time]);

ex 4.58
By querying lives_near($person_1, $person_2) each pair of people who live near each
other is listed twice; for example,

lives_near(["Hacker", "Alyssa", "P"], ["Fect", "Cy", "D"])
lives_near(["Fect", "Cy", "D"], ["Hacker", "Alyssa", "P"])

This happens b/c the rule lives_near($person1, $person2) is satisfied by both answers
satisfy the lives_near condition.

A solution is to introduce indexing in the database.
e.g. give each person a unique id and add the following rules:

lives_near($person_1, $person_2), id($person_1, $id1), id($person_2, $id2),
javascript_predicate("<", $id1, $id2);
*/
