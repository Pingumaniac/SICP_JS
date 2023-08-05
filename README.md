# SICP_JS 

This repository contains my solutions to exercises from the book "Structure and Interpretation of Computer Programs: JavaScript Edition." Notice that I have made notes from the original book "Structure and Interpretation of Computer Programs" but have decided to solve problems in NodeJS instead of Scheme.

These include:
1. implementing an interpreter in NodeJS for a subset of JS that uses applicative-order evaluation for Section 4.1
2. implementing an interpreter in NodeJS for a subset of JavaScript dialect that uses normal-order evaluation instead of applicative-order evaluation for Section 4.2
3. implementing an interpreter in NodeJS for non-deterministic computing for Section 4.3
4. implementing an interpreter in NodeJS for logic-programming language for Section 4.4
5. implemented a register machine in NodeJS that sequentially executes instructions that manipulates the contents of a fixed set of stoarge elements called registers for Section 5.1
6. implemented a register-machine simulator in NodeJS to test the machines that have been designed to see if they perform they expected for Section 5.2
7. implemented a garbage collection in NodeJS to provide an automatic storage allocation facility to support the illusion of an infinite memory for Section 5.3
8. implemented a explicit-control interpreter in NodeJS whose controller interprets JavaScript programs for Section 5.4
9. implementing a simple compiler in NodeJS that translates JavaScript programs into sequences of instructions that can be executed directly with the registers and operations of the evaluator register machine for Section 5.5
10. developing a rudimentary implementation of JS in Rust by translating the explicit-control evaluator of Section 5.4 into Rust and providing appropriate storage-allocation routines and other runtime support to run this code.
11. modification of the compiler so that it compiles JS functions into sequences of C instructions and compiled the metacircular evaluator of Section 4.1 to produce a JS interpreter written in Rust.

Note that this is my personal project for summer 2023 break.

## Who am I?
#### Young-jae Moon
* M.Sc. in computer science and Engineering Graduate Fellowship recipient at Vanderbilt University (January 2023 - December 2024).
* Email: youngjae.moon@Vanderbilt.Edu

## About each chapter

* Chapter 1: Building Abstractions with Functions
* Chapter 2: Building Abstractions with Data
* Chapter 3: Modularity, Objects, and States
* Chapter 4: Metalinguistic Abstraction
* Chapter 5: Computing with Register Machines
