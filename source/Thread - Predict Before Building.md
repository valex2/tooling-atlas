---
Tags: tooling-thread
Name: Predict Before Building
---
A throughline: tools that tell you the answer before you build the real thing, or instead of building it at all. A small model in a wind tunnel stands in for a whole airplane; a computer stands in for both. The point never changes, find out how a wing will fly or what shape a protein will take cheaply, on a model or a screen, instead of the slow, dear way of building it and testing it. The thread runs from physical stand-ins to pure computation, and it crosses domains, because the move from wind tunnel to simulation is the same move as from X-ray photograph to AI guess. Where [[Thread - Electronic Switching]] is the compute itself, this thread is what compute did to the rest of engineering: it ate the test.

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
