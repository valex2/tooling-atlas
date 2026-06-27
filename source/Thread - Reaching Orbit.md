---
Tags: tooling-thread
Name: Reaching Orbit
---
A throughline: who can throw a payload to orbit, and how that power moved. It rests on one stubborn tool, the rocket engine, which no one can calculate into working. You build it, fire it, watch it blow up, and the knowledge lives in the test stands and in the people who have blown up enough of them to know. So the craft travels in trained heads, von Braun out of Germany and Korolev's heirs in Russia, and it pools wherever someone fires engines at scale. The thread runs from a Nazi terror weapon to the Moon, to a decade when the nation that won the Moon rented rides from Russia, and back to cheap rockets that land and fly again. Where the carriers is about craft carried in people and [[Thread - Forced by War]] is about war paying for tools, this thread is the rocket itself, climbing.

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
