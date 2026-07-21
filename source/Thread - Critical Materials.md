---
Tags: tooling-thread
Name: Critical Materials
---
A throughline: the strategic materials nobody can do without, won not by owning the deposit but by mastering the process to pull one element from a near-identical crowd, or to conjure a compound from the air. Rare earths come pure only out of a hundred-tank solvent-extraction cascade ([[Tooling Card - The Solvent-Extraction Cascade]]); the uranium for a reactor or a bomb comes only out of the same cascade idea spun as gas ([[Tooling Card - The Gas Centrifuge]]); the nitrogen that feeds half the world is forced from the air under pressure ([[Tooling Card - Haber-Bosch]]); and the strongest magnet, the heart of every electric motor, is built from the rare earths the cascade separates ([[Tooling Card - The NdFeB Magnet]]). In each, the science is open and the ore is everywhere; the moat is the installed plant and the tacit process craft. It is the materials-world counterpart to the machine tool: a lead in the tool that makes materials is a lead in all of them, because chips, batteries, magnets, medicines, and fertilizer all draw from the same processing base. That is why these became China's sharpest chokepoints, and the cleanest proof of the deck's rule that the deposit is never the lead: whoever runs the process longest holds the material. The rule is not geographic. [[Tooling Card - Ajinomoto Build-up Film]] is the same shape held from Japan, a coated epoxy film with no scarce input at all, where the moat is thirty years of running the coating line and the eighteen months it takes a customer to qualify anyone else.

```dataviewjs
const cards = dv.pages("#tooling-card").where(p => (p.Threads ?? []).some(t => t.path === dv.current().file.path)).sort(p => p.Year, "asc");
if (!cards.length) { dv.paragraph("_No cards on this thread yet._"); } else { dv.table(["Card","Year","Place","Kind","Unlocked"], cards.map(p => [p.file.link, p.Year, p.Place, p.Kind, p.Unlocked])); }
```
