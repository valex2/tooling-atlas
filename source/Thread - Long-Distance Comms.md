---
Tags: tooling-thread
Name: Long-Distance Comms
---
A demand thread: the drive to send a signal farther than it wants to go. Distance kills a signal, so each tool here beats distance, first over wire, then through the air, then from orbit. The recurring deepest tool is the amplifier that rebuilds a fading signal: the vacuum tube, then the transistor. The thread forks at the tube (telephony and radio, with radar branching off in the war) and crosses into computing at the transistor. It runs from the transatlantic cable to Telstar.

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
