---
Tags: tooling-thread
Name: Microscopy
---
A throughline that runs through [[Tooling Leadership Home]]: the race to resolve ever finer detail. It starts with a single glass bead and runs until glass runs out. Abbe proves that light has a hard floor, and to go below it the tool has to stop being glass and start being something with a shorter wave. The thread deliberately crosses kinds, a lens then a law then a matter-wave then a beam of electrons, because the goal of seeing smaller outlives any one tool. Where [[Thread - Precision Optics]] is about the glass-craft itself, this thread is about the resolution it chases, and the two split apart exactly at Abbe's wall.

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
