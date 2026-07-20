---
Tags: tooling-thread
Name: Electronic Instruments
---
A throughline that runs through [[Tooling Leadership Home]]. No one builds a circuit they cannot see. The trade in instruments that make an electrical signal visible and measurable starts with a mirror on a thread reading a whisper off a transatlantic cable, passes through the feedback loop that made an amplifier honest enough to trust its own reading, and lands in a Palo Alto garage where Hewlett's audio oscillator became a product before the company had a second one. Tektronix's triggered sweep then froze a repeating waveform on a screen and made the oscilloscope the bench's standard eye, and the solderless breadboard let anyone lay out a circuit in an afternoon and probe it. The place was an instrument town before it was a chip town, and the instruments and the circuits they measured grew each other in the same square miles.

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
