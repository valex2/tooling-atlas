---
Tags: tooling-card
Name: Photolithography
Kind: Make
Tool: printing circuits with light
Person: Jay Lathrop and James Nall
Place: Washington, D.C., USA
Lat: 38.89
Lon: -77.03
City:
Era: 1950s
Year: 1957
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: every chip is printed with light
Significance: "Printing circuits with light rather than cutting them by hand made identical chips manufacturable by the wafer-load, and every chip since has been made this way."
BuildsOn:
  - "[[Tooling Card - Abbe's Diffraction Limit]]"
  - "[[Tooling Card - The Printing Press]]"
Enables:
  - "[[Tooling Card - The EUV Machine]]"
  - "[[Tooling Card - The Integrated Circuit]]"
  - "[[Tooling Card - The Wafer Stepper]]"
Threads:
  - "[[Thread - Chip Lithography]]"
---
*Make · United States · 1950s*
**Jay Lathrop and James Nall** · printing circuits with light

**Front.** By the mid-1950s the parts of a circuit were getting too small to place by hand. At an Army lab, [Jay Lathrop and James Nall](https://www.computerhistory.org/siliconengine/photolithography-techniques-are-used-to-make-silicon-devices/) borrowed a trick from the printing trade: a coating that hardens where light touches it. They painted a chip with it, shone light through a little [stencil of the circuit](https://en.wikipedia.org/wiki/Photolithography), then washed the soft parts away and etched the pattern into the chip below. The key move was to run a microscope backward, so its lens shrank a big drawing of the circuit down to a speck, finer than any hand could cut. They named it [photolithography](https://www.computerhistory.org/siliconengine/photolithography-techniques-are-used-to-make-silicon-devices/) in 1957, the same year [Bell Labs' Jules Andrus](https://en.wikipedia.org/wiki/Photolithography) was teaching the same printing trick to silicon. The new thing was that you could print a circuit with light, as fine as the lens could draw, a whole wafer at once.

**Back.** Once you could print one circuit, you could print a thousand in a single shot, and Fairchild married this to Jean Hoerni's flat [planar process](https://www.allaboutcircuits.com/textbook/designing-analog-chips/analog-devices/the-semiconductor-industry-and-the-planar-process/) to turn out whole wafers of identical chips. Every chip ever made since has been printed this way, and the race to print finer, with ever-shorter light, runs straight from this bench to the [house-sized machines](https://en.wikipedia.org/wiki/Photolithography) that print today's chips. The tool was American at birth, and the lead in printing with light stayed in the West for fifty years, until the hardest step of all walked off to a single company in the Netherlands.

*Curator's note:* **Placement.** Make cell, United States, 1957, the founding beat of [[Thread - Chip Lithography]]. Serves Goal 1 (chipmaking rides entirely on this technique) and Goal 2 (born American, the lead in printing-with-light later migrated to ASML in the Netherlands). Mechanism: Convergence, the one technique every chipmaker on Earth converged on. Confidence: direct. **Analysis.** This is the bridge the deck needed between optics and chipmaking. It carries Abbe's rule forward in a new use: you can print a line only as fine as the lens can resolve, so to print smaller you need shorter light, which is the whole later march to EUV. It is the technique under the device cards: the integrated circuit ([[Tooling Card - The Integrated Circuit]]) is printed this way, so The Switch and Printing With Light meet there, and the thread runs on to [[Tooling Card - The EUV Machine]] (EUV), the extreme end of the same idea. Hero, because it founds a thread and joins two halves of the chip story. No 1:1 pair set; its natural rhyme is the EUV card (the birth of printing-with-light versus its apex, US start versus Dutch capstone), flagged for you. **Nuance.** Two roots, kept together: Lathrop and Nall (at the Army's Diamond Ordnance Fuze Laboratory) started using photoresist on germanium in 1952 and coined "photolithography" in 1957, with the microscope-in-reverse projection; Jules Andrus and Walter Bond at Bell Labs adapted printing-industry photoengraving to silicon's oxide layer from 1955, and Andrus's patent was filed August 15, 1957 (issued 1964). They worked closely with Kodak, which supplied the photoresist. Jay Last and Robert Noyce built one of the first step-and-repeat cameras at Fairchild in 1958; Fairchild's first planar ICs followed in 1960.
