---
Tags: tooling-thread
Name: Robotics & Automation
---
The tools that let a machine move and place itself with precision: the near-zero-backlash reducer inside a robot's joint, the servo that holds a commanded angle, the arm geometries that stack them into a working reach. Leadership in the arm follows leadership in these parts, and the precision-reducer moat drifted from an American shoe-machinery shop to a handful of Japanese firms, the same toolmaking migration the machine-tool thread tells a century earlier.

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
