---
Tags: tooling-card
Name: Immersion Lithography
Kind: Make
Tool: 193nm immersion lithography
Person: Burn-Jeng Lin
Place: Hsinchu, Taiwan
Lat: 24.81
Lon: 120.97
City: Hsinchu
Era: 2000s
Year: 2002
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: another decade of smaller chips
Significance: "Slipping a film of water under the lens let the existing 193nm light print a dozen more chip generations, buying the industry a decade before EUV became unavoidable and helping ASML pull permanently ahead of Nikon in the process."
BuildsOn:
  - "[[Tooling Card - The Wafer Stepper]]"
Enables:
  - "[[Tooling Card - The High-Yield Process Recipe]]"
  - "[[Tooling Card - The EUV Machine]]"
Threads:
  - "[[Thread - Chip Lithography]]"
---
*Make · Hsinchu, Taiwan · 2000s*
**Burn-Jeng Lin** · a drop of water under the lens

**Front.** By 2002 chips were printed with deep-ultraviolet light [193 nanometres](https://en.wikipedia.org/wiki/Immersion_lithography) long, and the rule said that to print finer lines you needed shorter light still. The next step down, 157 nanometres, was turning into a nightmare: that light was soaked up by the very lenses meant to focus it. At a [2002 SEMATECH-organized 157 nm workshop](https://ethw.org/Burn_Jeng_Lin) on the troubled 157 step, an engineer from Taiwan's TSMC named [Burn-Jeng Lin](https://ethw.org/Burn_Jeng_Lin) stood up with a different idea. Don't change the light. Change what it travels through. [Slip a thin film of pure water between the lens and the chip](https://en.wikipedia.org/wiki/Immersion_lithography), and the light bends and slows so the same 193 beam acts like a shorter wave, nearer 134 nanometres, and prints finer lines with no new lamp at all. The new thing was not a sharper light. It was a drop of water that made the old light reach further down.

**Back.** That one trick bought the industry [another decade of optical lithography](https://www.spie.org/news/immersionlitho-intro) and a dozen chip generations, and pushed the brutally hard jump to EUV years down the road. It also settled a war: Japan's Nikon had been chasing the harder 157 light, while [ASML and TSMC threw in early with water](https://www.eetimes.com/tsmc-is-first-to-commit-to-193-nm-immersion-litho/), and that bet, plus ASML's lead toward EUV, helped the Dutch firm pull ahead of Nikon for good. Every chip from [45 nanometres](https://en.wikipedia.org/wiki/Immersion_lithography) down to the EUV era was printed through water. When you cannot get a shorter wave, change the stuff the light swims through.

*Curator's note:* **Placement.** Make cell, Hsinchu, 2002, a beat on [[Thread - Chip Lithography]] between the integrated circuit and EUV. Serves Goal 1 (it kept chips shrinking for a decade) and Goal 2 (a Taiwanese idea that helped move the lithography lead from Japan's Nikon to ASML in the Netherlands). Mechanism: Convergence, the whole industry converging on one resolution trick. Confidence: direct. **Analysis.** This is the prequel that explains EUV's long delay and ASML's rise. It is the "extend the wall" move set against [[Tooling Card - The EUV Machine]]'s "leap the wall": the cheap clever trick (water on the old light) that bought the years until the brutally expensive new light (EUV) was unavoidable, a natural rhyme with the EUV card, flagged. It also seeds the Taiwan story the [[Tooling Card - The High-Yield Process Recipe|TSMC]] card carries. **Nuance.** The physics is really about numerical aperture: water's refractive index (~1.44) lets the lens gather light at angles that give a numerical aperture above 1, and resolution scales with wavelength over NA, so the "acts like 134 nanometres" framing on the face is the common shorthand (193/1.44). Lin proposed it at a 2002 SEMATECH 157 nm workshop; ASML shipped the first commercial immersion scanner (XT:1250i) in 2004 to IBM and TSMC. Nikon was not absent from immersion (it shipped the first NA>1.0 tool in 2005); the simplification is that Nikon leaned longer on the 157 nm path and lacked ASML's EUV roadmap, so the card says "chasing the harder 157 light," not that Nikon ignored water.
