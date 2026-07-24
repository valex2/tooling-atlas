---
Tags: tooling-thread
Name: Navigation & Position
---
The instruments that answer "where am I?" at sea and on land: a magnetized needle for heading, a brass disc that projects the sky to fix latitude and time, a mirror instrument that measures a star's angle from a rolling deck, and a clock accurate enough to carry Greenwich time around the world for longitude. Position-finding decided sea power and empire from 1400 to 1800, and the craft migrated across places — Song China, the Abbasid world, then the workshops of London — which is the point: a tech trend is not tied to one geography, it moves.

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
