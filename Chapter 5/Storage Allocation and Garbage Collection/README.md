# Notes


## Two considerations in implementing list structure. (533-534)

1. An issue of representation: how to represent the “box-andpointer” structure of Lisp pairs, using only the storage and addressing capabilities of typical computer memories.

2. Management of memory as a computation proceeds.
* The operation of a Lisp system depends crucially on the ability to continually create new data objects.
* These include objects that are explicitly created by the Lisp procedures being interpreted as well as structures created by the interpreter itself, such as environments and argument lists.
* Although the constant creation of new data objects would pose no problem on a computer with an infinite amount of rapidly addressable memory, computer memories are available only in finite sizes (more’s the pity).
* Lisp systems thus provide an automatic storage allocation facility to support the illusion of an infinite memory.
* When a data object is no longer needed, the memory allocated to it is automatically recycled and used to construct new data objects.
* Lisp -> garbage collection

## Memory as Vectors

* Vectors used as a data structure to represent computer memory

### Primitive Procedures for manipulating Vectors
* (vector-ref ⟨vector⟩ ⟨n⟩)

returns the nth element of the vector.

* (vector-set! ⟨vector⟩ ⟨n⟩ ⟨value⟩)

sets the nth element of the vector to the designated value.
