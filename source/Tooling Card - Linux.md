---
Tags: tooling-card
Name: Linux
Kind: Model
Tool: open-source operating-system kernel
Person: Linus Torvalds
Place: Helsinki, Finland
City: Helsinki
Lat: 60.17
Lon: 24.94
Era: 1990s
Year: 1991
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: a free operating-system kernel anyone could copy and improve
Significance: "A student gave away a whole working Unix-like kernel with its source open, and the free copy grew to run most of the world's computers."
BuildsOn:
  - "[[Tooling Card - Unix and C]]"
Enables:
  - "[[Tooling Card - The Hypervisor]]"
  - "[[Tooling Card - MapReduce]]"
Threads:
  - "[[Thread - Software Abstraction]]"
---
*Model · Helsinki, Finland · 1990s*
**Linus Torvalds** · a free Unix-like kernel, source open

**Front.** One evening in 1991, a second-year student in Helsinki named [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds) sat at his new 386 PC, wanting a Unix he could run and rewrite at home. The [Minix](https://en.wikipedia.org/wiki/History_of_Linux) system he used for class came locked behind a textbook's rules, so he set out to write his own core program from scratch, the part that hands memory to running programs and talks to the disk and the screen. In August he posted the source to a Minix newsgroup, calling it ["just a hobby, won't be big"](https://www.tomshardware.com/software/linux/linux-is-34-years-old-today-linus-torvalds-meekly-announced-this-free-new-os-in-the-comp-os-minix-newsgroup-on-this-day-in-1991), and let anyone copy or change it. Every line of the kernel was open to read and rebuild, and within weeks strangers were mailing him back their fixes.

**Back.** In [1992](https://www.redhat.com/en/blog/celebrating-30-years-linux-kernel-and-gplv2) Torvalds put the kernel under the GPL, a license that forced anyone who shipped a changed copy to hand their changes back, so every improvement flowed into one shared pool. Companies, universities, and lone hackers poured in code for the next thirty years, and the kernel that "won't be big" grew to run [every one](https://www.top500.org/statistics/details/osfam/1/) of the world's 500 fastest supercomputers, most cloud servers, and the heart of every [Android phone](https://source.android.com/docs/core/architecture/kernel). The kernel stayed free and worth nothing to sell, so the money gathered downstream, in the service contracts, cloud rentals, and phones built on top of it.

