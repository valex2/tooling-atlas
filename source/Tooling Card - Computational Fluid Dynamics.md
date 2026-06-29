---
Tags: tooling-card
Name: Computational Fluid Dynamics
Kind: Model
Tool: computational fluid dynamics
Person: Dean Chapman
Place: NASA Ames, California, USA
Lat: 37.41
Lon: -122.06
City: NASA Ames
Era: 1970s-80s
Year: 1979
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: aircraft designed on a screen
Significance: "CFD let Boeing cut wind-tunnel test rounds from 77 to 10 on the 777, showing that cheap compute could replace much of physical testing and keeping the aircraft design lead where the supercomputers were."
BuildsOn:
  - "[[Tooling Card - The Variable-Density Tunnel]]"
Enables:
Threads:
  - "[[Thread - Predict Before Building]]"
  - "[[Thread - Flight]]"
---
*Model · NASA Ames, California · 1970s-80s*
**Dean Chapman** · solving the air on a computer

**Front.** In 1979 a NASA engineer named [Dean Chapman](https://history.arc.nasa.gov/hist_pdfs/bio_chapman.pdf) made a bet that sounded absurd: the wind tunnel would one day be replaced by a computer. For decades you learned how a wing flew by building a small model and blowing air at it, the way [[Tooling Card - The Variable-Density Tunnel|Langley had done since the 1930s]]. Chapman wanted to skip the model and solve the air itself, every push and swirl, as numbers on a machine. The trouble was sheer arithmetic, far more than any computer of the day could chew through. So back in 1970 he had built his group around [the strangest, fastest machine he could get, a parallel supercomputer called the Illiac IV](https://en.wikipedia.org/wiki/ILLIAC_IV), and bet the machines would only get faster. He was not asking for a better tunnel. He was asking to treat the wind itself as a calculation.

**Back.** The bet paid off as the chips kept getting cheaper. By the 1980s [Cray supercomputers](https://en.wikipedia.org/wiki/Cray-1) could solve the flow over a whole wing, and design slid off the tunnel floor and onto the screen. When Boeing built the 777 in the 1990s, it ran [about 10 rounds of wing tests in the wind tunnel where older jets had needed 77](https://ntrs.nasa.gov/api/citations/20120016316/downloads/20120016316.pdf). The tunnel did not vanish. The wildest, swirliest air still will not fully compute, so the two work side by side. But cheap compute had reached back and remade how you build an airplane, the same trick it would later pull to [[Tooling Card - AlphaFold|fold a protein]].

