---
Tags: tooling-thread
Name: Reading & Writing DNA
---
The throughline that made life programmable. It is the software story replayed in wetware: an abstraction, the central dogma, declared that life runs on a code, and once it was code you could build a rising stack of tools to read it, copy it, cut it, edit it, and finally design it, each tool hiding the chemistry beneath. The thread is a loop that starts and ends on one question, what shape is this molecule, photographed at the bottom and computed at the top, with the code abstraction in the middle that turned everything between into typing. Where [[Thread - Electronic Switching]] is computing's stack, this is biology's, and the moat climbs the same way, from the bench to the read-write tools to the AI layer.

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
