# SICP_JS 

This repository contains my solutions to exercises from the book "Structure and Interpretation of Computer Programs: JavaScript Edition." Notice that I have made notes from the original book "Structure and Interpretation of Computer Programs" but have decided to solve problems in NodeJS instead of Scheme.

Notable projects includes:
1. implementing a explicit-control interpreter in NodeJS whose controller interprets JavaScript programs for Section 5.4
2. implementing a simple compiler in NodeJS that translates JavaScript programs into sequences of instructions that can be executed directly with the registers and operations of the evaluator register machine for Section 5.5
3. developing a rudimentary implementation of JS in Rust by translating the explicit-control evaluator of Section 5.4 into Rust and providing appropriate storage-allocation routines and other runtime support to run this code.
4. modification of the compiler so that it compiles JS functions into sequences of C instructions and compiled the metacircular evaluator of Section 4.1 to produce a JS interpreter written in Rust.

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
