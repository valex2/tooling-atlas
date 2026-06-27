---
Tags: tooling-thread
Name: Machine Tools
---
A throughline through [[Tooling Leadership Home]]. The trade in machines that cut metal to a fixed size, the tools that make all the other tools. It starts from an empty bench around 1820, is carried out of Britain and grown in the American Northeast through arms, textiles, sewing machines, and bicycles, then moves again: west to Detroit with the automobile, across the Pacific to Japan with cheap CNC, and on to China, which now builds the machine bodies but still buys the brain. Watching this one craft move is the clearest case of the second claim, that tool leadership does not stay put.

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
