---
Tags: tooling-card
Name: Unix and C
Kind: Make
Tool: Unix and the C language
Person: Ken Thompson and Dennis Ritchie
Place: Murray Hill, New Jersey, USA
Lat: 40.68
Lon: -74.4
City: Murray Hill
Era: 1969-73
Year: 1969
Goal: Both
Mechanism: Fragility
Confidence: Direct
Unlocked: software unwelded from the machine
Significance: "Unix and C cut software loose from the hardware it ran on. An antitrust decree barred AT&T from selling software, so Bell Labs gave the system away, spreading the standard until no one came to own it."
BuildsOn:
  - "[[Tooling Card - The Transistor]]"
  - "[[Tooling Card - The Punch Card]]"
  - "[[Tooling Card - FORTRAN]]"
  - "[[Tooling Card - The Integrated Circuit]]"
  - "[[Tooling Card - The Self-Hosting Compiler]]"
Enables:
  - "[[Tooling Card - The Deep-Learning Framework]]"
Threads:
  - "[[Thread - Software Abstraction]]"
---
*Make · Murray Hill, New Jersey, USA · 1969-73*
**Ken Thompson and Dennis Ritchie** · Unix and the C language

**Front.** In 1969, Bell Labs walked away from a swollen joint operating-system project called [Multics](https://spectrum.ieee.org/the-strange-birth-and-long-life-of-unix), and a programmer named Ken Thompson lost the machine he liked to play on. He had written a game, Space Travel, and wanted somewhere to run it. He found a [cast-off DEC PDP-7](https://computerhistory.org/blog/the-earliest-unix-code-an-anniversary-source-code-release/) in a corner and, with Dennis Ritchie, wrote a small, plain operating system for it over that summer. Underneath sat a thin layer between a program and the bare machine that handed out the machine's memory, its time, and its files, so a programmer no longer had to drive the raw hardware. They built it out of small tools that each did one thing well, joined by [pipes that fed one program's output into the next](https://thenewstack.io/pipe-how-the-system-call-that-ties-unix-together-came-about/).

**Back.** Three years later Ritchie added the other half: a new language, C, one step up from the machine's raw code but close enough to run fast. In 1973 they [rewrote almost all of Unix in it](https://www.read.seas.harvard.edu/~kohler/class/aosref/ritchie84evolution.pdf), so the system was no longer welded to one machine. To move it, you recompiled the C instead of writing it again by hand, and in 1977 they [carried Unix onto a wholly different make of computer](https://en.wikipedia.org/wiki/Interdata_7/32_and_8/32) to prove it. A [1956 antitrust decree](https://www.eff.org/deeplinks/2020/05/unix-and-adversarial-interoperability-one-weird-antitrust-trick-defined-computing) barred AT&T from selling software, so Bell Labs shipped the source to universities for about the cost of the tape, and a generation learned how an operating system works by reading and rebuilding it. By the [1984 Bell breakup](https://en.wikipedia.org/wiki/Breakup_of_the_Bell_System) the standard had escaped into free clones like [Linux](https://en.wikipedia.org/wiki/History_of_Linux) that no one owned, and C had become the language the world writes its systems in. Software had come loose from the machine it was born on. Android, macOS, and the cloud all run on the descendants of the system Bell Labs gave away for the price of a tape.

