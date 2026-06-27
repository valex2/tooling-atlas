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
Significance: "Unix and C decoupled software from the hardware it ran on, and an antitrust decree that barred AT&T from selling software forced Bell Labs to give it away, spreading the standard so widely that no one ended up owning it."
BuildsOn:
  - "[[Tooling Card - The Transistor]]"
  - "[[Tooling Card - The Punch Card]]"
  - "[[Tooling Card - FORTRAN]]"
  - "[[Tooling Card - The Integrated Circuit]]"
Enables:
  - "[[Tooling Card - The Deep-Learning Framework]]"
Threads:
  - "[[Thread - Software Abstraction]]"
---
*Make · Murray Hill, New Jersey, USA · 1969-73*
**Ken Thompson and Dennis Ritchie** · Unix and the C language

**Front.** In 1969, Bell Labs walked away from a swollen joint operating-system project called [Multics](https://spectrum.ieee.org/the-strange-birth-and-long-life-of-unix), and a programmer named Ken Thompson lost the machine he liked to play on. He had written a game, Space Travel, and wanted somewhere to run it. He found a [cast-off DEC PDP-7](https://computerhistory.org/blog/the-earliest-unix-code-an-anniversary-source-code-release/) in a corner and, with Dennis Ritchie, wrote a small, plain operating system for it over that summer. The new thing was the thin layer underneath: it sat between a program and the bare machine and handed out the machine's memory, its time, and its files, so a programmer no longer had to drive the raw hardware. They built it out of small tools that each did one thing well, joined by [pipes that fed one program's output into the next](https://thenewstack.io/pipe-how-the-system-call-that-ties-unix-together-came-about/).

**Back.** Three years later Ritchie added the other half: a new language, C, one step up from the machine's raw code but close enough to run fast. In 1973 they [rewrote almost all of Unix in it](https://www.read.seas.harvard.edu/~kohler/class/aosref/ritchie84evolution.pdf), so the system was no longer welded to one machine. To move it, you recompiled the C instead of writing it again by hand, and in 1977 they [carried Unix onto a wholly different make of computer](https://en.wikipedia.org/wiki/Interdata_7/32_and_8/32) to prove it. A [1956 antitrust decree](https://www.eff.org/deeplinks/2020/05/unix-and-adversarial-interoperability-one-weird-antitrust-trick-defined-computing) barred AT&T from selling software, so Bell Labs shipped the source to universities for about the cost of the tape, and a generation learned how an operating system works by reading and rebuilding it. By the [1984 Bell breakup](https://en.wikipedia.org/wiki/Breakup_of_the_Bell_System) the standard had escaped into free clones like [Linux](https://en.wikipedia.org/wiki/History_of_Linux) that no one owned, and C had become the language the world writes its systems in. Software had come loose from the machine it was born on, and the lead settled with no one. It went wherever the building happened next.

*Curator's note:* **Placement.** Make / Murray Hill (Bell Labs), 1969-73, Goal Both. Mechanism Fragility: a tool so good and so cheap to copy that its owner could not keep it, so the lead scattered downstream (BSD, then Android, macOS, the cloud) instead of concentrating; C adds a Convergence undertone, becoming the one language the world writes its systems in. Role Hero. Confidence high on the spine (Multics exit 1969, Thompson on the PDP-7 that summer, C in 1972, the Unix-in-C rewrite 1973, the 1956 consent decree, the 1977 Interdata port, the 1984 breakup, Linux 1991). **This card merges two earlier ones** (Unix the operating-system layer + C the portable language): they were the same two people, the same lab, and a three-year arc, and as separate cards they kept telling the same escaped-standard story, so the front now carries the layer and the back carries the language and the open escape.

**Analysis.** The deck's cleanest software Fragility case, and the top of the [[Thread - Portable Software]] stack. It carries the thread's committed two-way pair with [[Tooling Card - The Punch Card]]: a program chained to one machine's pattern of holes, versus software freed to run on any machine. Cross-links: built on a transistorized PDP-7, so it runs on the hardware of [[Tooling Card - The Transistor]] and ends the bare-metal world the punch-card card describes; its digital substrate is [[Tooling Card - The Bit]]; the same C later runs on the cheap embedded microcontrollers that [[Thread - Electronic Switching]] hands off to [[Tooling Card - The Mass-Produced CNC Controller]]; born inside [[Thread - Bell Labs]], the monopoly-funded lab whose own antitrust shackles set the work free. Hero, carries the thread's payoff on its own.

**Nuance.** Figure caveats: the "$100" is the Version 7 (1979) university source license, not a 1969-era price (early versions went for the cost of media), so the body says "about the cost of the tape" rather than a number. The pipes idea traces to McIlroy's 1964 memo, but the working pipe was Thompson's autumn-1973 implementation, so the body stays vague on the date. The 1973 Unix-in-C rewrite was Thompson and Ritchie jointly (Thompson on the kernel, Ritchie on the language and compiler) and has no single canonical day; "almost all" is the honest hedge. C grew out of Thompson's B, itself from BCPL, renamed C in 1972. The 1977 port was Bell Labs onto the Interdata 8/32, while Wollongong University independently ported it to the 7/32. The "escaped into Linux" clause compresses a messy decade (the AT&T v. BSDi suit, the GNU userland) into one line, defensible for a card. Sources: [IEEE Spectrum](https://spectrum.ieee.org/the-strange-birth-and-long-life-of-unix), [Computer History Museum](https://computerhistory.org/blog/the-earliest-unix-code-an-anniversary-source-code-release/), [Ritchie's "Evolution of the Unix Time-sharing System"](https://www.read.seas.harvard.edu/~kohler/class/aosref/ritchie84evolution.pdf), [EFF on the 1956 decree](https://www.eff.org/deeplinks/2020/05/unix-and-adversarial-interoperability-one-weird-antitrust-trick-defined-computing), [History of Unix](https://en.wikipedia.org/wiki/History_of_Unix), [Breakup of the Bell System](https://en.wikipedia.org/wiki/Breakup_of_the_Bell_System), [History of Linux](https://en.wikipedia.org/wiki/History_of_Linux); all dates cross-checked.
