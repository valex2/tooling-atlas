---
Tags: tooling-card
Name: The Through-Silicon Via
Kind: Manufacture
Tool: copper posts drilled and filled through a wafer
Person: Mitsumasa Koyanagi
Place: Sendai, Japan
City: Sendai
Lat: 38.26
Lon: 140.87
Era: 1990s
Year: 1995
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: stacked memory and the packaging line under AI chips
Significance: "Drilling and filling copper posts straight down through a silicon die let chips be stacked face to face instead of wired around their edges, and the yield on that step is now the constraint on every AI accelerator built."
BuildsOn:
  - "[[Tooling Card - Atomic Layer Deposition]]"
  - "[[Tooling Card - DRAM]]"
  - "[[Tooling Card - Photolithography]]"
  - "[[Tooling Card - The Bosch Process]]"
Enables:
  - "[[Tooling Card - CoWoS Advanced Packaging]]"
  - "[[Tooling Card - The Scaled-Up Language Model]]"
Threads:
  - "[[Thread - Wafer Processing]]"
  - "[[Thread - Electronic Switching]]"
---
*Manufacture · Sendai, Japan · 1990s*
**Mitsumasa Koyanagi** · copper posts run down through a chip

**Front.** By 1989 the parts on a chip were shrinking every year and the wires between chips were not. [Mitsumasa Koyanagi](https://ethw.org/Mitsumasa_Koyanagi), a professor at Tohoku University who had spent his earlier career designing memory at Hitachi, put the problem to a symposium in a talk called ["Roadblocks in achieving 3-dimensional LSI"](https://sst.semiconductor-digest.com/2015/12/koyanagi-and-ramm-win-3dic-pioneering-award/). A signal leaving one chip had to travel sideways to the edge of the die, out along a bond wire, across the board, and back in again. The short way was straight down. [Shockley had patented deep pits cut through a wafer in 1958](https://www.3dincites.com/2010/04/who-invented-the-through-silicon-via-tsv-and-when/) and nobody had made them pay. Koyanagi's group spent the next six years turning that into a sequence a wafer line could run, and [by 1995 they had it working on an image sensor](https://sst.semiconductor-digest.com/2015/12/koyanagi-and-ramm-win-3dic-pioneering-award/): etch narrow holes down into the face of a wafer, line them and fill them with metal, grind the wafer away from the back until the metal pokes through, then press two wafers together on small bumps of solder so the buried posts meet.

**Back.** Nothing much shipped for a decade, because drilling tens of thousands of holes per die and getting every one filled solid without a void is a yield problem rather than a design problem. [Samsung bonded eight NAND dies into a single 16-gigabit part in 2006](https://phys.org/news/2006-04-samsung-3d-memory-package-greatly.html), the first stack built on the wafer instead of assembled afterward. In 2011 TSMC ran the same holes through a blank slab of silicon and used it as a floor to seat four [Xilinx FPGA tiles](https://eda360insider.wordpress.com/2011/10/27/3d-thursday-generation-jumping-2-5d-xilinx-virtex-7-2000t-fpga-delivers-1954560-logic-cells-using-6-8-billion-transistors/) side by side, then sold that line to every other customer as CoWoS. [SK Hynix built the first high-bandwidth memory in 2013](https://en.wikipedia.org/wiki/High_Bandwidth_Memory), a tower of DRAM dies each ground to [about 50 micrometres](https://www.wevolver.com/article/what-is-hbm-high-bandwidth-memory-deep-dive-into-architecture-packaging-and-applications) and wired vertically into a path 1024 bits wide. The etch-and-fill recipe has been in the open literature since Koyanagi published it, and reading it has let nobody jump the queue: [TSMC's packaging capacity climbed from roughly 35,000 wafers a month in late 2024 toward 130,000 by the end of 2026](https://siliconanalysts.com/analysis/foundry-allocation-status-q1-2026) and stayed sold out the whole way, with three memory makers and one foundry holding the machines.

