---
Tags: tooling-thread
Name: Production Systems
---
A throughline that runs through [[Tooling Leadership Home]]. The craft of turning one working thing into a million identical ones. It is not the machine that cuts the part, which is [[Thread - Machine Tools]], but the arrangement of machines, people, and rules that keeps the parts coming out the same. It starts in the silk filatures of Song China and the cotton mills of Derbyshire, is codified in the American armory shops, and reaches its first full form on Ford's moving line in Highland Park. Then it moves: to Raytheon's magnetron presses in the war, to Ohno's Toyota, to the Fanuc controllers that let a small shop run a line, and finally to the yield recipes of a Taiwanese fab, where the product is a wafer and the craft is still the same one. Each move carried the lead in whatever the line happened to be building, which is the deck's second claim in its plainest form.

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
