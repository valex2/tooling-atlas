---
Tags: tooling-card
Name: FORTRAN
Kind: Model
Tool: a compiler from math-like code to machine code
Person: John Backus
Place: New York, New York, USA
Lat: 40.71
Lon: -74.01
City: New York
Era: 1950s
Year: 1957
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: programs written in math, not machine code
Significance: "FORTRAN's optimizing compiler proved a program written in plain math could run nearly as fast as hand-tuned machine code, so software finally split from the one machine it was written for."
BuildsOn:
  - "[[Tooling Card - The Punch Card]]"
Enables:
  - "[[Tooling Card - Unix and C]]"
  - "[[Tooling Card - Smalltalk]]"
  - "[[Tooling Card - The Self-Hosting Compiler]]"
Threads:
  - "[[Thread - Software Abstraction]]"
---
*Model · New York, USA · 1950s*
**John Backus** · a compiler from math to machine code

**Front.** In the early 1950s, telling a computer what to do meant writing out long rows of numbers by hand, one for each tiny step the machine took. [John Backus](https://www.ibm.com/history/john-backus), a programmer at IBM, called it "hand-to-hand combat with the machine," and the machine usually won. In [1953 he proposed](https://www.ibm.com/history/fortran) something most people thought impossible: a way to write the math the way a person writes it, and have a program turn that into the machine's own number code. His team spent three years building it, and what made [FORTRAN](https://en.wikipedia.org/wiki/Fortran) work was the [optimizing compiler](https://en.wikipedia.org/wiki/Fortran), the translator part, which produced code that ran [nearly as fast as the best hand-written code](https://www.ibm.com/history/fortran). It shipped in April 1957.

**Back.** Skeptics had said no automatic translator could ever match a person coding by hand. FORTRAN proved them wrong, and from then on you could trust a compiler. A program no longer had to be written for one specific machine; write it in FORTRAN, and any computer with a FORTRAN compiler could run it, [splitting the software from the hardware](https://www.ibm.com/history/fortran). The idea was published and copied freely. Nearly seventy years on, weather models, physics codes, and the fastest supercomputers still run FORTRAN, and every high-level language since hides the machine the way Backus first did.

