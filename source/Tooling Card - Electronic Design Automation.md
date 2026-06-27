---
Tags: tooling-card
Name: Electronic Design Automation
Kind: Model
Tool: chip-design software (VLSI/EDA)
Person: Carver Mead and Lynn Conway
Place: Pasadena, California, USA
Lat: 34.15
Lon: -118.14
City: Pasadena
Era: 1980
Year: 1980
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: the fabless and foundry split
Significance: "Turning chip design into software split designing a chip from making it, creating the fabless-and-foundry model, and the design tools settled into three American firms that still hold most of the market."
BuildsOn:
  - "[[Tooling Card - The Integrated Circuit]]"
  - "[[Tooling Card - Sketchpad]]"
Enables:
  - "[[Tooling Card - The High-Yield Process Recipe]]"
Threads:
  - "[[Thread - Prototyping & CAD]]"
  - "[[Thread - Chip Lithography]]"
---
*Model · Pasadena and Silicon Valley, USA · 1980*
**Carver Mead and Lynn Conway** · chip-design software (VLSI/EDA)

**Front.** By the late 1970s a single chip could hold around [twenty thousand transistors](https://en.wikipedia.org/wiki/Mead%E2%80%93Conway_VLSI_chip_design_revolution), far more than any one person could place by hand. In 1980, Carver Mead at Caltech and Lynn Conway at Xerox PARC put out a thin book, *Introduction to VLSI Systems*, that turned chip design into a few [simple rules](https://www.edn.com/the-book-that-changed-everything/). The rules let an ordinary engineer describe a chip in software and hand the rest to a computer. The chip was not the new thing. The new thing was that the machine, not the wizard, now placed the transistors, routed the wires, and drew the masks.

**Back.** This split the designing of a chip from the making of it. A company could now write a chip in software and own no factory at all, which opened the way to the fabless firm and the foundry that builds for it. The software that does the designing settled into a few American houses, Cadence, Synopsys, and Mentor, that today hold [about three-quarters](https://www.silicon.co.uk/e-regulation/china-chip-design-620616) of the world market, a grip even China cannot yet pry loose. The lead stayed with whoever made the tools that design the tools.

*Curator's note:* **Placement.** Cell: Prototyping Tooling → Models (a field-defining abstraction layer, not a physical tool). Goal: Both (commercial and strategic). Mechanism: Convergence — the world settled on a handful of US toolchains and a durable design-layer moat formed. Confidence: High on the abstraction-and-moat thesis and the present-day market grip; medium on the exact publication year (see Nuance).

**Analysis.** This card adds the *design layer* of the chip stack: the software that turns logic into a manufacturable layout. Its real work is as a **bridge**. It descends from interactive CAD ([[Tooling Card - Sketchpad]]) and designs the chips of [[Tooling Card - The Integrated Circuit]], carrying the Computer-Aided Design island into the chip world. More importantly it *enables* the design-make split of [[Tooling Card - The High-Yield Process Recipe]]: without a software description that a separate fab can build from, the fabless/foundry model has nothing to hand across the line. It is the abstraction-stack flavor of a Model card (like [[Tooling Card - The Central Dogma]]), not the no-moat flavor — the moat re-forms at the top of the stack, in the EDA tools themselves. Threads: Computer-Aided Design, Chip Lithography.

**Nuance + sources.** Publication year is genuinely disputed: Addison-Wesley's canonical printing is dated **1980** (used here, per the card spec), but the book was written 1978–79 and several sources cite **1979** — FLAG. The "tens of thousands of transistors" framing rests on contemporary parts like the Intel 8086 (1978), ~20,000 active / [~29,000 counting ROM/PLA sites](http://www.righto.com/2023/01/counting-transistors-in-8086-processor.html); I used the conservative ~20,000 figure. Market-share figure: Synopsys/Cadence/Siemens(Mentor) held [~70% globally and ~80% in China](https://www.silicon.co.uk/e-regulation/china-chip-design-620616) as of 2024; "Mentor" is now Siemens EDA, kept as Mentor for the era voice. The 2025 US export-control episode (curbs imposed in late May, [rescinded in July](https://www.cnbc.com/2025/07/03/us-lifts-chip-software-curbs-on-china-amid-trade-truce-synopsys-says-.html)) confirms the chokepoint but is left out of the body to keep the aftermath plain. Sources: [Mead–Conway VLSI revolution (Wikipedia)](https://en.wikipedia.org/wiki/Mead%E2%80%93Conway_VLSI_chip_design_revolution), [EDN "The book that changed everything"](https://www.edn.com/the-book-that-changed-everything/), [Silicon UK on EDA market share](https://www.silicon.co.uk/e-regulation/china-chip-design-620616).
