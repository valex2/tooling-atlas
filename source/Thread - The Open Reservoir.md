---
Tags: tooling-thread
Name: The Open Reservoir
---
A throughline that runs through [[Tooling Leadership Home]]. A built, maintained, non-rival pile of data with a format, a curator, and a rule that says what must be deposited. The pile itself is free to everyone, which is exactly why leadership never sits in it: it re-forms downstream, in whoever has the compute, the instruments, or the distribution to use the pile hardest. Crystallographers agreed to deposit structures and got the Protein Data Bank; forty years later DeepMind read the whole of it and built AlphaFold. Cheap sequencing filled the sequence archives. Fei-Fei Li paid crowdworkers to label fourteen million images and handed the field ImageNet. Against these sits the counter-case: a pile of the same kind that was deliberately closed and kept ([[Tooling Card - The Social Graph]]). Published methods are not reservoirs; a reservoir has a curator and a deposition rule.

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
