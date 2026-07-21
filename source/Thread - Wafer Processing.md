---
Tags: tooling-thread
Name: Wafer Processing
---
A throughline that runs through [[Tooling Leadership Home]]. Everything done to a silicon wafer that is not printing the pattern on it: firing dopant atoms in, growing a film a single atom thick, polishing each layer flat before the next one goes down, and drilling copper posts straight through the finished die. Lithography gets the attention because it sets how small a feature can be, but a chip is built by hundreds of these other steps, and each one has to work on every wafer. The thread crosses places (Peabody, Helsinki, East Fishkill, Hsinchu, Sendai), which is the point: a tech trend is not tied to one geography, it migrates.

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
