/*
1. Generic operations with explicit dispatch:
    - Add new types: Add new cases to the dispatch function.
    - Add new operations: Add new functions to the system.
    - Most appropriate for a system in which new data types and new operations shall often be added.
    - Least appropriate for a system in which new data types and new operations are rarely added.
2. Data-directed style:
    - Add new types: Add new types to the data type table.
    - Add new operations: Add new functions to the data type table.
    - Most appropriate for a system in which new data types shall often be added.
    - Least appropriate for a system in which new operations shall often be added.
3. Message-passing style:
    - Add new types: Add new methods to the data type table.
    - Add new operations: Add new methods to the data type table.
    - Most appropriate for a system in which new operations shall often be added.
    - Least appropriate for a system in which new data types shall often be added.
*/
