---
Tags: tooling-thread
Name: Software Abstraction
---
A throughline: software climbing a ladder of hiding, where each new layer covers up the one below so a person can build something bigger without holding the whole thing in their head. It starts with writing rows of machine numbers by hand, then a compiler hides the machine ([[Tooling Card - FORTRAN]]), then objects hide a program's own tangle ([[Tooling Card - Smalltalk]]), then tables hide where the data physically sits ([[Tooling Card - The Relational Model]]), and a portable operating system hides the differences between machines ([[Tooling Card - Unix and C]]). Almost every tool on this thread is a Model: a published abstraction that everyone copies, so it confers prestige and not a lasting moat, and the lead pools downstream in whoever builds and sells on top of it. Where [[Thread - Electronic Switching]] is the hardware getting smaller, this thread is the software getting taller.

Cards on this thread, oldest first:

```dataviewjs
const cards = dv.pages("#tooling-card")
  .where(p => (p.Threads ?? []).some(t => t.path === dv.current().file.path))
  .sort(p => p.Year, "asc");
if (!cards.length) { dv.paragraph("_No cards on this thread yet._"); }
else {
  dv.table(["Card", "Year", "Place", "Kind", "Unlocked"],
    cards.map(p => [p.file.link, p.Year, p.Place, p.Kind, p.Unlocked]));
}
```
