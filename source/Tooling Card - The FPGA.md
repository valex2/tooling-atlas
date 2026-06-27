---
Tags: tooling-card
Name: The FPGA
Kind: Make
Tool: chip whose logic is set in software
Person: Ross Freeman
Place: San Jose, California, USA
Lat: 37.34
Lon: -121.89
City: San Jose
Era: 1980s
Year: 1985
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: respin a chip's logic in an afternoon, not months at a fab
Significance: "The FPGA let engineers rewire a chip's logic from a software file in seconds instead of ordering a new custom chip, and grew into a US-held industry for thirty-five years."
BuildsOn:
  - "[[Tooling Card - The Integrated Circuit]]"
Threads:
  - "[[Thread - Prototyping & CAD]]"
  - "[[Thread - Electronic Switching]]"
---
*Make · San Jose, USA · 1980s*
**Ross Freeman** · a chip you rewire from a file

**Front.** In 1985 an engineer named [Ross Freeman](https://spectrum.ieee.org/fpga-chip-ieee-milestone), who had just helped start a company called Xilinx, shipped a strange chip. Until then, if you wanted a chip to do a new job you designed it and ordered it from a [factory, which took months and a great deal of money](https://spectrum.ieee.org/fpga-chip-ieee-milestone). Freeman's [XC2064 came from the factory blank, with about 64 small blocks of logic](https://spectrum.ieee.org/fpga-chip-ieee-milestone) and a web of wires between them you could connect however you liked by loading a file into the chip. The chip's circuit was now set in software, and you could erase it and lay down a different one in seconds.

**Back.** A [field-programmable gate array](https://en.wikipedia.org/wiki/Field-programmable_gate_array) let engineers try a chip's logic in an afternoon instead of waiting months for a fab, and for products too small to justify a custom chip it became the chip itself. It grew into its own industry, long held by two American firms, [Xilinx and Altera, until AMD and Intel bought them](https://en.wikipedia.org/wiki/Field-programmable_gate_array). The tool that kept chip design cheap and fast stayed in American hands for thirty-five years.

*Curator's note:* Placement: Make; Goal Both; Convergence (a reconfigurable substrate everyone designing chips can reach for). Confidence Direct. Analysis: this is the hard end of [[Thread - Prototyping & CAD]] and the sibling to [[Tooling Card - The Breadboard]], the point where a prototyping tool stopped being just a bench convenience and became a durable industry. It also rides [[Thread - Electronic Switching]], since it is a special case of the integrated circuit ([[Tooling Card - The Integrated Circuit]]) turned reconfigurable. It carries Goal 2 unusually cleanly: unlike the breadboard, the FPGA's advantage hardened into a two-firm American lead that held for a generation, so it shows a prototyping tool growing into market power. Nuance: the XC2064's logic-equivalent gate count is given variously as roughly 1,000 to 1,500, and that is equivalent gates, not transistor count (about 85,000); the figure on the face is kept to the 64 logic blocks, which is firm.
