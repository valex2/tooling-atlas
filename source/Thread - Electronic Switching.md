---
Tags: tooling-thread
Name: Electronic Switching
---
The electronic switch, a device that controls a current with a current and has no moving parts, shrinking from a hot glass tube to an invisible feature on silicon. Each leap is forced by a wall, until a whole computer fits on a chip cheap enough to be a machine's brain. The thread forks off [[Thread - Long-Distance Comms]] at the transistor and hands off to the machine-tool story at the microcontroller, the cheap brain FANUC embeds.

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
