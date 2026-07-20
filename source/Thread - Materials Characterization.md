---
Tags: tooling-thread
Name: Materials Characterization
---
A throughline: the tools that read what a material is made of and how its atoms are arranged. It splits in two. Composition asks *which atoms*: a prism reads an element from the lines in its light ([[Tooling Card - The Spectroscope]]), and a magnetic field weighs them one kind at a time ([[Tooling Card - The Mass Spectrograph]]). Structure asks *where the atoms sit*: scattered X-rays give their exact arrangement ([[Tooling Card - X-ray Crystallography]]), electrons and then a single-atom needle let you see them directly ([[Tooling Card - The Electron Microscope]], [[Tooling Card - The Scanning Tunneling Microscope]]). This is the deepest Measure layer in the deck: you cannot reliably Make or Manufacture a material whose makeup and structure you cannot first read, which is why the same instruments sit under the chips, the turbines, the drugs, and the molecules of life. Where [[Thread - Seeing Smaller]] is about seeing *bigger small things*, this thread is about knowing *what they are*.

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
