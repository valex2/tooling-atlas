---
Tags: tooling-thread
Name: Bulk Materials
---
A throughline that runs through [[Tooling Leadership Home]]. Making an abundant material by the ton instead of by the pound. Where [[Thread - Critical Materials]] is about pulling a scarce element out of a near-identical crowd, this thread is the opposite problem: the input is everywhere, iron ore and air and acrylic yarn, and the whole difficulty is volume, heat and consistency. It starts with crucible smiths who could make superb steel a few pounds at a time and never write down how, moves to a furnace tall enough to pour iron as a liquid, and turns at Bessemer, where five tons became steel in twenty minutes and a cutlery metal became rails and beams and machine frames. The pattern repeats whenever a material goes from precious to structural: ammonia forced out of the air, carbon fibre cooked from sweater yarn. The lead goes to whoever holds the furnace settings, and the price of the material falls until everything downstream is rebuilt around it. The thread crosses places (the Deccan, Norberg, London, Ludwigshafen, Osaka), which is the point: a tech trend is not tied to one geography, it migrates.

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
