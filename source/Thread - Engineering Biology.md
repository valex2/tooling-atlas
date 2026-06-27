---
Tags: tooling-thread
Name: Engineering Biology
---
A throughline: the make-side of biology, the tools that do not read or decode life but build things with it. Where [[Thread - Reading & Writing DNA]] is about learning the code, this thread is about engineering with it: splice a gene into a cell so it churns out a human protein ([[Tooling Card - Recombinant DNA]]), fuse cells into a living factory for one exact antibody ([[Tooling Card - Monoclonal Antibodies]]), write a DNA sequence from scratch ([[Tooling Card - DNA Synthesis]]), cut and rewrite a living genome ([[Tooling Card - CRISPR-Cas9]]), and hand a cell a typed instruction to make its own medicine ([[Tooling Card - The Modified RNA Letter]]). These are the tools that turned biology from a science you study into an industry you build in, and most are non-rival methods, so leadership went not to a patent but to whoever could wield them at scale. The two biology threads are the same split that runs through the whole deck: reading versus making.

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
