---
Tags: tooling-card
Name: The Self-Hosting Compiler
Kind: Make
Tool: a compiler written in the language it compiles
Person: Tim Hart and Mike Levin
Place: Cambridge, Massachusetts, USA
City: Cambridge
Lat: 42.36
Lon: -71.09
Era: 1960s
Year: 1962
Goal: Both
Mechanism: Fragility
Confidence: Direct
Unlocked: software tools that build the next version of themselves
Significance: "A compiler written in its own language is built by an older copy of itself, so the whole software stack rests on a chain of binaries no one can read, as Ken Thompson showed by hiding a back door in one."
BuildsOn:
  - "[[Tooling Card - FORTRAN]]"
Enables:
  - "[[Tooling Card - Unix and C]]"
  - "[[Tooling Card - Smalltalk]]"
Threads:
  - "[[Thread - Software Abstraction]]"
---
*Make · Cambridge, Massachusetts, USA · 1960s*
**Tim Hart and Mike Levin** · a compiler written in its own language

**Front.** In 1962 two staffers in MIT's artificial-intelligence group, [Tim Hart and Mike Levin](https://en.wikipedia.org/wiki/History_of_compiler_construction), were tired of waiting on a slow machine. Lisp code then ran under an interpreter, a program that reads your code and acts on it a line at a time, and the waiting was long enough to lose your place. So they wrote a compiler, which reads the code once and writes out the number code the machine runs directly, and they wrote it in Lisp, the same language it was built to translate. Then they fed the compiler's own text to the interpreter and let it grind. Out came the compiler itself as machine code, and Lisp then ran about [forty times faster](https://en.wikipedia.org/wiki/Lisp_(programming_language)). The copy on the tape had been made by the compiler working on itself, so from then on each version was built by the version before it and no outside language was needed to make one.

**Back.** Every serious toolchain since is built the same way. A C compiler compiles C compilers, and [GCC builds itself three times over](https://gcc.gnu.org/install/build.html), then compares the last two binaries byte for byte to check the middle one did its job. Around 1975 [Ken Thompson at Bell Labs](https://research.swtch.com/nih) followed the chain to its dark end. He taught a C compiler to slip a secret password into the login program, and to plant that same habit into any compiler it went on to build, then deleted both tricks from the source. He put the doctored compiler on his own machine and, [advertising a new feature](https://niconiconi.neocities.org/posts/ken-thompson-really-did-launch-his-trusting-trust-trojan-attack-in-real-life/), got the Unix support group down the hall to take a copy; within about a month their login program had the back door, and every page of source anyone read was clean. It survived until someone stopped the compiler one step short of a finished program and finished the job by hand. Thompson told the story in his [1984 Turing Award lecture](https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf) and kept the code for another thirty-nine years. In 2015 programmers in China, waiting on slow downloads from Apple, grabbed a fast local copy of Xcode that a stranger had quietly altered, and [thousands of iPhone apps](https://unit42.paloaltonetworks.com/novel-malware-xcodeghost-modifies-xcode-infects-apple-ios-apps-and-hits-app-store/) shipped to the App Store with his code inside.

