# Notes

## Descriptions of Simulator interface procedures (514)

* (make-machine ⟨register-names⟩ ⟨operations⟩ ⟨controller⟩)

constructs and returns a model of the machine with the given registers, operations, and controller.

* (set-register-contents! ⟨machine-model⟩ ⟨register-name⟩ ⟨value⟩)

stores a value in a simulated register in the given machine.

* (get-register-contents ⟨machine-model⟩ ⟨register-name⟩)

returns the contents of a simulated register in the given machine.

* (start ⟨machine-model⟩)

simulates the execution of the given machine, starting from the beginning of the controller sequence and stopping when
it reaches the end of the sequence.
