---
Tags: tooling-card
Name: The MOSFET
Kind: Make
Tool: the MOS field-effect transistor
Person: Mohamed Atalla and Dawon Kahng
Place: Murray Hill, New Jersey, USA
Lat: 40.68
Lon: -74.4
City: Murray Hill
Era: 1960s
Year: 1960
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: every digital chip and Moore's law
Significance: "A transistor defined entirely by flat printed layers on a silicon oxide surface can be shrunk and printed a billion at a time, which is the physical fact that Moore's law and every digital device since 1960 rides on."
BuildsOn:
  - "[[Tooling Card - The Integrated Circuit]]"
Enables:
  - "[[Tooling Card - DRAM]]"
  - "[[Tooling Card - The Microprocessor]]"
Threads:
  - "[[Thread - Electronic Switching]]"
---
*Make · Murray Hill, New Jersey · 1960s*
**Mohamed Atalla and Dawon Kahng** · a switch on a clean oxide skin

**Front.** In late 1959 two engineers at Bell Labs in New Jersey, [Mohamed Atalla and Dawon Kahng](https://www.computerhistory.org/siliconengine/metal-oxide-semiconductor-mos-transistor-demonstrated/), were fighting a messy silicon surface, full of flaws that wrecked any switch built on it. Atalla had found that baking silicon in air grows its own thin skin of [glassy oxide](https://en.wikipedia.org/wiki/MOSFET) that seals the surface clean. So they laid a strip of metal on that skin, and the metal's charge reached down through the glass, never touching the silicon, to pull a thread of current open and shut beneath it. The new thing was not a faster switch. It was a flat one. The whole transistor was now just a patch of silicon, its skin of glass, and a strip of metal, stacked at the surface and shaped by light, with nothing to place or solder by hand. That flatness is what let you make them in parallel: grow and print these layers across a whole wafer in one set of steps, and every switch on it is made at once, a million for the same work as one, and you get more each time you print the pattern finer. They showed it in [1960](https://www.computerhistory.org/siliconengine/metal-oxide-semiconductor-mos-transistor-demonstrated/).

**Back.** That little flat switch turned out to be the one you could copy a billion times on a fingernail and keep shrinking, which is the whole ride [Moore's law](https://en.wikipedia.org/wiki/MOSFET) sits on. In [1963](https://www.computerhistory.org/siliconengine/complementary-mos-circuit-configuration-is-invented/) Frank Wanlass at Fairchild paired two of them so a circuit drew almost no power at rest. Every phone, laptop, and data center now runs on it, and it is the [most-made object people have ever built](https://www.computerhistory.org/blog/13-sextillion-counting-the-long-winding-road-to-the-most-frequently-manufactured-human-artifact-in-history/): about 13 sextillion of them between 1960 and 2018, more than 99.9% of all transistors ever. The lead did not die in a drawer this time. It spread to everyone and kept building on itself for sixty years.

*Curator's note:* **Placement.** Make cell, Murray Hill, 1960. Founding beat of [[Thread - Electronic Switching]] and a beat on [[Thread - Bell Labs]]. Serves Goal 1: digital electronics rides entirely on this one device, and the leadership followed whoever could make it well. Mechanism: Convergence, the point all later digital tooling pours into, with pace-layers under it (the device is the slow substrate every faster layer stacks on). Confidence: Direct on the device, the date, and the most-manufactured claim; all double-sourced. This is the deepest tool of The Switch, and the card says so plainly. **Analysis.** This is the load-bearing card of the digital half of the deck. The Switch thread forks off [[Thread - Long-Distance Comms]] here and hands down to [[Tooling Card - The Mass-Produced CNC Controller]], where this same scalable switch, grown cheap, becomes the brain FANUC buries in a machine tool. It is a clean Convergence hero, not fragility: unlike [[Tooling Card - Leeuwenhoek's Microscope]], the method was published, copied, and the lead compounded rather than dying with the makers, because the moat moved downstream into manufacturing (see [[Tooling Card - The EUV Machine]], where the same scaling race ends at one machine). No 1:1 pair set; the sharpest contrast is the bipolar transistor (the switch that worked first but would not shrink), which the deck does not yet have a card for, a candidate future pair. On the Bell Labs thread it is the seed device, the mastery of pure silicon crystal throwing off the tool that later dissolved AT&T itself. **Nuance.** Sourcing convention varies: the device was fabricated in November 1959 and presented in 1960 at the Solid-State Device Conference at Carnegie Institute of Technology, Pittsburgh; the card uses 1960 as the public moment, matching the frontmatter Year. "Sips almost no power" leans on the CMOS pairing; the bare 1960 MOSFET was actually slow and low-power but not yet the near-zero-standby device, that is Wanlass and Sah's 1963 complementary pair (US patent 3,356,858, "Low stand-by power complementary field effect circuitry," nanowatt standby). The 13-sextillion / 99.9% figure is the Computer History Museum's 2018 count and is the headline number across sources. "Silicon's own clean oxide is why silicon beat germanium" is the standard account: germanium has no stable, sealing native oxide, so the gate trick worked on silicon. The parallel-manufacturing point the front now makes belongs jointly to the planar process and photolithography (Hoerni and Noyce, see [[Tooling Card - The Integrated Circuit]]); the MOSFET is the switch that rides them best because it is wholly a surface device, defined by printed flat layers with nothing to tune per device. The refinement that cemented it was the self-aligned silicon-gate process (Faggin and others at Fairchild, 1968), which let the gate line itself up with the rest of the transistor and removed the touchiest alignment step, making dense MOS chips practical. The model held with no resistance; this is one of the cleanest Convergence cases in the deck.
