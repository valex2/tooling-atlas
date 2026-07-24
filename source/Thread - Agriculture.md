---
Tags: tooling-thread
Name: Agriculture
---
A throughline: the tools that raise how much food a plot of land and a tank of water can yield. Each one attacks a different limit on the harvest. Pull nitrogen straight out of the air so any field can be fertilized cheaply ([[Tooling Card - Haber-Bosch]]). Force a grain that pollinates itself to cross-breed, so its seed carries the extra vigour of a hybrid ([[Tooling Card - Hybrid Rice]]). Build a missing vitamin into the part of the grain people eat ([[Tooling Card - Golden Rice]]). Meter water one slow drop at each root so a crop grows on desert sand instead of drinking a flooded field ([[Tooling Card - Drip Irrigation]]).

The pattern that runs through the thread is the split the whole deck turns on: the idea travels, the making stays. Haber's reaction and Yuan's seed system and Blass's dripper were all published or given away, yet the lead sat for years with whoever could build the high-pressure vessel, remake the parent seed each season, or mould the emitter line by the mile. Feeding more people is less about knowing how than about making the tool at scale.

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
