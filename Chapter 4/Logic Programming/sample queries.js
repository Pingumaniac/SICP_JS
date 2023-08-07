let address = (person, location) => ["address", person, location];
let job = (person, job) => ["job", person, job];
let salary = (person, salary) => ["salary", person, salary];
let supervisor = (person1, person2) => ["supervisor", person1, person2];
let can_do_job = (job1, job2) => ["can_do_job", job1, job2];

// Information about Ben Bitdiddle
let ben_address = address(["Bitdiddle", "Ben"], ["Slumerville", ["Ridge", "Road"], 10]);
let ben_job = job(["Bitdiddle", "Ben"], ["computer", "wizard"]);
let ben_salary = salary(["Bitdiddle", "Ben"], 122000);

// Ben supervises two programmers and one technician. Info about them
let alyssa_address = address(["Hacker", "Alyssa", "P"], ["Cambridge", ["Mass", "Ave"], 78]);
let alyssa_job = job(["Hacker", "Alyssa", "P"], ["computer", "programmer"]);
let alyssa_salary = salary(["Hacker", "Alyssa", "P"], 81000);
let alyssa_supervisor = supervisor(["Hacker", "Alyssa", "P"], ["Bitdiddle", "Ben"]);

let cy_address = address(["Fect", "Cy", "D"], ["Cambridge", ["Ames", "Street"], 3]);
let cy_job = job(["Fect", "Cy", "D"], ["computer", "programmer"]);
let cy_salary = salary(["Fect", "Cy", "D"], 70000);
let cy_supervisor = supervisor(["Fect", "Cy", "D"], ["Bitdiddle", "Ben"]);

let lem_address = address(["Tweakit", "Lem", "E"], ["Boston", ["Bay", "State", "Road"], 22]);
let lem_job = job(["Tweakit", "Lem", "E"], ["computer", "technician"]);
let lem_salary = salary(["Tweakit", "Lem", "E"], 51000);
let lem_supervisor = supervisor(["Tweakit", "Lem", "E"], ["Bitdiddle", "Ben"]);

// There is also a programmer trainee, who is supervised by Alyssa
let louis_address = address(["Reasoner", "Louis"], ["Slumerville", ["Pine", "Tree", "Road"], 80]);
let louis_job = job(["Reasoner", "Louis"], ["computer", "programmer", "trainee"]);
let louis_salary = salary(["Reasoner", "Louis"], 62000);
let louis_supervisor = supervisor(["Reasoner", "Louis"], ["Hacker", "Alyssa", "P"]);

// Ben is a high-level employee. His supervisor is the company's big wheel himself
let oliver_supervisor = supervisor(["Bitdiddle", "Ben"], ["Warbucks", "Oliver"]);
let oliver_address = address(["Warbucks", "Oliver"], ["Swellesley", ["Top", "Heap", "Road"]]);
let oliver_job = job(["Warbucks", "Oliver"], ["administration", "big", "wheel"]);
let oliver_salary = salary(["Warbucks", "Oliver"], 314159);

// Besides the computer division supervised by Ben, the company has an accounting division,
// consisting of a chief accountant and his assistant:
let eben_address = address(["Scrooge", "Eben"], ["Weston", ["Shady", "Lane"], 10]);
let eben_job = job(["Scrooge", "Eben"], ["accounting", "chief", "accountant"]);
let eben_salary = salary(["Scrooge", "Eben"], 141421);
let eben_supervisor = supervisor(["Scrooge", "Eben"], ["Warbucks", "Oliver"]);

let robert_address = address(["Cratchet", "Robert"], ["Allston", ["N", "Harvard", "Street"], 16]);
let robert_job = job(["Cratchet", "Robert"], ["accounting", "scrivener"]);
let robert_salary = salary(["Cratchet", "Robert"], 26100);
let robert_supervisor = supervisor(["Cratchet", "Robert"], ["Scrooge", "Eben"]);

// There is also an administrative assistant for the big wheel:
let dewitt_address = address(["Aull", "DeWitt"], ["Slumerville", ["Onion", "Square"], 5]);
let dewitt_job = job(["Aull", "DeWitt"], ["administration", "assistant"]);
let dewitt_salary = salary(["Aull", "DeWitt"], 42195);
let dewitt_supervisor = supervisor(["Aull", "DeWitt"], ["Warbucks", "Oliver"]);

// computer wizard can do the jobs of both a computer programmer and a computer technician
let wizard_can_do_programmer = can_do_job(["computer", "wizard"], ["computer", "programmer"]);
let wizard_can_do_technician = can_do_job(["computer", "wizard"], ["computer", "technician"]);
// A computer programmer could fill in for a trainee:
let programmer_can_do_trainee = can_do_job(["computer", "programmer"], ["computer", "programmer", "trainee"]);
// Also, as is well known,
let assistant_can_do_big_wheel = can_do_job(["administration", "assistant"], ["administration", "big", "wheel"]);

// sample query input
// let sample_query_input = job($x, ["computer", "programmer"]);

