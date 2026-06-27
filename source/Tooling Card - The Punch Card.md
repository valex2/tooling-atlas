---
Tags: tooling-card
Name: The Punch Card
Kind: Make
Tool: the punched-card program deck
Person: an IBM 704 programmer
Place: Poughkeepsie, New York, USA
Lat: 41.7
Lon: -73.93
City:
Era: 1950s-60s
Year: 1954
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: programs that drove the bare machine directly
Significance: "When a program was a deck of physical holes fed raw to one machine, it was both the beginning of stored-program computing and the problem the operating system had to solve: one job, one machine, no abstraction."
Enables:
  - "[[Tooling Card - FORTRAN]]"
  - "[[Tooling Card - Unix and C]]"
  - "[[Tooling Card - The Relational Model]]"
BuildsOn:
  - "[[Tooling Card - The Bombe]]"
Threads:
  - "[[Thread - Software Abstraction]]"
---
*Make · United States · 1950s-60s*
**an IBM 704 programmer** · the punched-card program deck

**Front.** In the mid-1950s, a programmer at an IBM 704 site wrote out her program one line at a time, each line going on its own stiff paper card. A key punch cut small rectangular holes into each card, a hole or no-hole in every spot, [80 columns](https://www.historyofinformation.com/detail.php?id=596) across the standard card IBM had fixed in 1928. She carried the deck to the machine room, fed it into the reader, and [waited in line](https://en.wikipedia.org/wiki/Computer_programming_in_the_punched_card_era) while the machine ran one job at a time. The new thing was not the program. It was that the holes drove the bare machine directly, with nothing sitting between the code and the hardware.

**Back.** This was a slow and unforgiving world. One mis-punched hole ruined the run, and a dropped deck shuffled out of order had to be sorted back by hand, which is why programmers wrote a [sequence number](https://en.wikipedia.org/wiki/Computer_programming_in_the_punched_card_era) into the last columns and ran the deck through a card sorter to put it right. A deck cut for one make of computer ran on no other. Every program owned the bare machine, one at a time, until the operating system slid a thin layer between the program and the metal and ended it.

*Curator's note:* **1) Placement.** Cell: Make / United States (IBM mainframes), 1950s-60s. Goal 1. This is the bare-metal "before" card, the empty-bench opener for the operating-system thread. Mechanism: by design it carries *no clean moat*. It sets the starting state of the world (program = physical holes, fed raw to the machine, one job at a time) that every later card in the thread reacts against. Confidence: high. Year 1954 anchors the moment on the IBM 704 era (the FORTRAN 72-column convention came up on this family); the 80-column card origin is firmly 1928. Figure caveats: none load-bearing are disputed.

**2) Analysis.** What it ADDS: the zero-point. There is no abstraction layer yet — the reader sees the program as nothing but holes and the CPU executes them on the raw hardware. It defines the two pains the rest of the thread fixes: (a) the program owns the whole machine one at a time, and (b) the deck is chained to one make of computer. Not a parade of specs — the front is a single scene, the back is the cost of that scene. It sits against the candidate **C card** (program chained to one machine's holes → program freed to run on any machine; Thread: Portable Software) and against the OS card that ends one-at-a-time bare-metal ownership. Cross-links: the hole *is* a physical bit, and Shannon's 1948 result that all information reduces to bits makes that literal — [[Tooling Card - The Bit]]. The bare machine underneath was built of vacuum tubes, then transistors — [[Tooling Card - The Transistor]], [[Thread - Electronic Switching]]. Thread membership: [[Thread - Portable Software]].

**3) Nuance.** "One line per card" is the programming convention, not a hardware law — data cards held data, and control cards (job setup) rode in the same deck; I kept the front to the program-instruction case for clarity. The columns-73-80 sequence-number practice is real and well-attested: it is the FORTRAN card-column convention (statements in columns 1-72, sequence numbers in 73-80), not a hardware limit of the 711 reader, which physically read all 80 columns. I kept the back to "last columns" to avoid a spec dump. "No operating system" is true of the early-to-mid 1950s bare-metal style; rudimentary monitors/batch supervisors (e.g. GM-NAA I/O, 1956, on the 704) arrived later in the decade, so this card is the genuine *before* and the OS card is the turn. The "different makes used incompatible decks" point is sound even though IBM's conventions were widely copied. Sourcing trail: 80-column / 1928 cross-checked on historyofinformation.com and Computing History UK; batch/bare-metal/one-job-at-a-time and the dropped-deck sequence-number practice cross-checked on the Wikipedia "Computer programming in the punched card era" article and a second search snippet citing the same 73-80 / card-sorter detail and the IBM 711 72-column origin. No single-sourced load-bearing figures; nothing flagged as disputed.
