---
Tags: tooling-card
Name: The Hypervisor
Kind: Make
Tool: one machine sliced into many isolated computers
Person: Robert Creasy and Mendel Rosenblum
Place: Cambridge, Massachusetts, USA
Lat: 42.37
Lon: -71.11
City: Cambridge
Era: 1960s
Year: 1967
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: compute you can rent by the hour
Significance: "The hypervisor lets one physical computer pretend to be many separate, fully isolated ones, the tool that decades later turned computing into something you rent by the hour."
BuildsOn:
  - "[[Tooling Card - The Microprocessor]]"
Threads:
  - "[[Thread - The Network]]"
---
*Make · Cambridge, USA · 1960s*
**Robert Creasy and Mendel Rosenblum** · one machine pretending to be many

**Front.** In the mid-1960s a computer was a single, very expensive machine that ran one job at a time, and a crash by one user took everyone with it. At [IBM's Cambridge Scientific Center](https://en.wikipedia.org/wiki/CP/CMS), a team led by [Robert Creasy](https://www.taskade.com/blog/virtualization-history) tried a strange fix: write a thin layer of software that hands each user a whole *pretend* computer, a [complete virtual machine](https://en.wikipedia.org/wiki/CP/CMS) with its own memory and devices, while underneath there is still just the one real machine sharing itself out. Their system, [CP-67, went into daily use in 1967](https://en.wikipedia.org/wiki/CP/CMS). Each virtual machine was walled off from the others, so one could crash and the rest never noticed. The new thing was that the computer itself had become something you could copy in software.

**Back.** The trick lived quietly in the mainframe world for nearly thirty years, because the cheap chips that took over could not be sliced this way. Then in [1998 a Stanford professor, Mendel Rosenblum, with his wife Diane Greene and his students, started VMware](https://en.wikipedia.org/wiki/VMware) and solved the hard part, [tricking the stubborn Intel x86 chip into being virtualized by rewriting its awkward instructions on the fly](https://awards.acm.org/award_winners/rosenblum_4094918). Now any ordinary server could be cut into many. That is the tool the [cloud is built on](https://www.taskade.com/blog/virtualization-history): Amazon, Microsoft, and Google rent out these virtual machines by the hour, millions at a time, and the lead in selling raw computing pooled into a handful of American firms.

