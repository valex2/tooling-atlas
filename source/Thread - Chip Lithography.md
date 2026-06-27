---
Tags: tooling-thread
Name: Chip Lithography
---
A throughline: how we learned to print a circuit with light, and then to print it ever smaller. It starts with a clever trick, running a microscope backward to shrink a drawing down onto a chip, and it never stops shrinking, because a finer line needs a shorter wave of light, the same rule Abbe drew for the microscope. Each step down the spectrum, from ordinary light to deep ultraviolet to the extreme ultraviolet of today, was a wall the chipmakers had to climb. Where [[Thread - Electronic Switching]] is the device you print, this thread is the printing, and the two meet at the integrated circuit. It runs from a 1950s lab bench to the house-sized machine in the Netherlands that prints every advanced chip.

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
