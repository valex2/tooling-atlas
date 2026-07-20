---
Tags: tooling-thread
Name: Measure and Correct
---
A throughline that runs through [[Tooling Leadership Home]]. Accuracy generated from nothing: measure a thing against itself, correct whatever the measurement betrays, and repeat until the error stops shrinking. Maudslay cut a screw with a screw to get a truer screw. Whitworth rubbed three plates against each other to get a flat with no flat to copy. Norton's grinder held size across a production run by measuring the part as it cut. Shewhart turned the loop into arithmetic on a shop floor, plotting a process against its own scatter. Zeiss aimed an ion beam at a mirror and took off exactly the atoms the map said were high. ASML put the measurement inside the scanner so the machine corrects itself between exposures. The loop is the opposite move from comparing a part to an outside standard ([[Tooling Card - The Go-No-Go Gauge]]), and it has migrated from a London bench to a Dutch fab without changing shape.

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
