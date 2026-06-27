---
Tags: tooling-thread
Name: Precision Optics
---
A throughline that runs through [[Tooling Leadership Home]]. The craft of grinding and arranging glass to see what the eye cannot: it starts with a single bead in Delft, and the same underlying competence resurfaces centuries later in cheap paper scopes and in the extreme optics of chip lithography. The thread crosses places (Delft, Stanford, and back toward the Netherlands with ASML), which is the point: a tech trend is not tied to one geography, it migrates.

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
