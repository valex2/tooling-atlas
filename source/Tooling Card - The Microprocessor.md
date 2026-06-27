---
Tags: tooling-card
Name: The Microprocessor
Kind: Make
Tool: the single-chip processor
Person: Hoff, Faggin, Mazor, and Shima
Place: Santa Clara, California, USA
Lat: 37.35
Lon: -121.95
City: Santa Clara
Era: 1970s
Year: 1971
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: the personal computer and the embedded chip
Significance: "Putting a general-purpose CPU on one buyable chip meant any machine could be given a programmable mind, and the craft of laying that mind out in silicon spread to whoever could learn it, as Shima carried it to Japan."
BuildsOn:
  - "[[Tooling Card - The MOSFET]]"
Enables:
  - "[[Tooling Card - The GPU]]"
  - "[[Tooling Card - The Hypervisor]]"
  - "[[Tooling Card - The Microcontroller]]"
  - "[[Tooling Card - MapReduce]]"
Threads:
  - "[[Thread - Electronic Switching]]"
---
*Make · Santa Clara, California · 1970s*
**Hoff, Faggin, Mazor, and Shima** · a whole CPU on one chip

**Front.** In 1969 a Japanese calculator firm, [Busicom](https://en.wikipedia.org/wiki/Intel_4004), came to a young chip shop in California with a heavy order: a dozen custom chips for a desk calculator, each one hard-wired to do its own little job. An Intel engineer named [Ted Hoff](https://www.computerhistory.org/siliconengine/microprocessor-integrates-cpu-function-onto-a-single-chip/) thought there was a simpler way. Instead of many fixed chips, build one small chip that could do general work, then feed it a list of steps to follow, the way a real computer does. He and Stanley Mazor drew the plan; [Federico Faggin](https://www.computerhistory.org/siliconengine/microprocessor-integrates-cpu-function-onto-a-single-chip/) and Busicom's own [Masatoshi Shima](https://en.wikipedia.org/wiki/Masatoshi_Shima) packed the thinking part of a computer, [about 2,300 tiny switches](https://spectrum.ieee.org/chip-hall-of-fame-intel-4004-microprocessor), onto a single sliver of silicon in a [16-pin case](https://en.wikipedia.org/wiki/Intel_4004) you could hold on a fingertip. It went on sale [on 15 November 1971](https://www.intel.com/content/www/us/en/history/virtual-vault/articles/the-intel-4004.html). For the first time, the brain of a computer was one thing you could buy.

**Back.** That little brain, the [4004](https://timeline.intel.com/1971/the-first-programmable-microprocessor:-the-4004) and the bigger ones right after it, opened the way to the personal computer: the first machine you could buy as a blank mind and teach with software, instead of wiring it up part by part for one fixed job. The men who built it carried the new craft outward: [Shima went on to Intel and then Zilog](https://en.wikipedia.org/wiki/Masatoshi_Shima), helped draw two more landmark chips, and [took the know-how home to Japan](https://computerhistory.org/profile/masatoshi-shima/), founding a design center there in 1980. The lead did not die in one shop. It spread to whoever could learn to lay a mind out in silicon, and it built on itself for fifty years.

*Curator's note:* **Placement.** Make cell, Silicon Valley, 1971. Serves Goal 1 (compute leadership rides on the tool, the general-purpose chip you can buy) and Goal 2 (the craft moved, carried by Shima back to Japan). Mechanism: Convergence, a whole CPU, the control, the arithmetic, and the registers, collapsing onto one slab, with pace-layers underneath (the silicon-gate craft Faggin brought). Confidence: direct on every load-bearing fact, the date, the four people, the Busicom origin, and the transistor count all cross-checked across Intel, the Computer History Museum, and IEEE Spectrum. **Analysis.** This is a parade card, not a hero: it fills out the breadth of [[Thread - Electronic Switching]] at the moment the switch stops being a single device and becomes a whole machine, the fork the thread was built to reach. It pairs 1:1 with [[Tooling Card - The Microcontroller]], the microcontroller, on a clean contrast: the 4004 is the *mind* alone (a CPU that still needs memory and support chips around it), while the microcontroller folds the whole little computer onto one chip cheap enough to be a machine's brain. It is also a genuine beat on the carriers, and an unusual one: most carrier cards move tacit craft *in* to a rising power, while Shima carried it the other way, learning the new art in California and seeding it back in Japan, the trained head crossing the border a generation before the output followed. **Nuance.** "First commercial single-chip microprocessor" is the standard claim and is well sourced, though contemporaries (TI's TMS 1000, the military MP944) contest the very-first title on technicalities; the card sidesteps this by saying "first time you could buy the brain of a computer," which holds. Transistor count is cited as ~2,300 across sources; clock was 740 kHz. Hoff and Mazor wrote the architecture, Faggin made it work in silicon, and Shima did logic design and verification, so "Hoff, Faggin, Mazor, and Shima" credits all four as the sources do, without ranking them. First working part was delivered March 1971; general sale 15 November 1971.
