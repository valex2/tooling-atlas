---
Tags: tooling-thread
Name: Flight
---
A throughline: how humans learned to fly, and the tools behind it. Flight is the model case for the deck's whole argument, because you cannot fake it: a wing either holds the air or it does not, and an engine either keeps running at altitude or it does not. It rests on tools to predict a shape before you build it ([[Tooling Card - The Variable-Density Tunnel]], [[Tooling Card - Computational Fluid Dynamics]]), to power it ([[Tooling Card - The Jet Engine]]), and to make the parts that survive the heat ([[Tooling Card - Investment Casting]], the single-crystal turbine blade). Each is a different one of the four Ms pointed at the same hard problem, and leadership in aviation has always followed leadership in these tools.

```dataviewjs
const cards = dv.pages("#tooling-card").where(p => (p.Threads ?? []).some(t => t.path === dv.current().file.path)).sort(p => p.Year, "asc");
if (!cards.length) { dv.paragraph("_No cards on this thread yet._"); } else { dv.table(["Card","Year","Place","Kind","Unlocked"], cards.map(p => [p.file.link, p.Year, p.Place, p.Kind, p.Unlocked])); }
```
