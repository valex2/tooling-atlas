---
Tags: tooling-card
Name: CoWoS Advanced Packaging
Kind: Manufacture
Tool: 2.5D chip-on-wafer packaging
Person: TSMC (Shang-Yi Chiang / Morris Chang era)
Place: Hsinchu, Taiwan
City: Hsinchu
Lat: 24.81
Lon: 120.97
Era: 2010s
Year: 2011
Goal: 2
Mechanism: Fragility
Confidence: Direct
Unlocked: the 2.5D packaging behind every modern AI accelerator
Significance: "CoWoS made the silicon interposer the mandatory last step in building an AI accelerator, and put that step almost entirely under Taiwan's control."
BuildsOn:
  - "[[Tooling Card - The Through-Silicon Via]]"
Enables:
  - "[[Tooling Card - The GPU]]"
Threads:
  - "[[Thread - Chip Lithography]]"
  - "[[Thread - Wafer Processing]]"
---
*Manufacture · Hsinchu, Taiwan · 2010s*
**TSMC (Shang-Yi Chiang / Morris Chang era)** · dies on a silicon interposer

**Front.** By 2011 the biggest chips had grown too large to print in one piece, and the plastic board under a processor could not carry wires fine enough to feed it memory fast enough. At [TSMC](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm) in Hsinchu a team under [Shang-Yi Chiang](https://www.trendforce.com/news/2023/09/04/news-chiang-shang-yi-former-tsmc-co-coo-shares-china-experience-and-cowos-development/) had worked on the problem since 2009: they took a bare slab of silicon, [criss-crossed it with copper wires](http://www.3dic.org/CoWoS) far finer than any board could hold, and set a logic chip and its stacks of memory side by side on top, bonded down through thousands of tiny bumps about [45 microns apart](https://semiwiki.com/semiconductor-manufacturers/tsmc/366052-the-chronicle-of-tsmc-cowos/). Gluing that wired slab to a substrate under the chips let two separate dies pass signals as if they were one piece. TSMC called the method [CoWoS](https://pr.tsmc.com/english/news/1746), and the first part built on it, shown that year, was a Xilinx chip cut into four slices.

**Back.** For a decade CoWoS was a quiet trick, used for a handful of pricey parts and once treated as a joke inside the company. Then the AI rush hit: every [Nvidia H100](https://www.nextpcb.com/blog/cowos-packaging-h100-b200), and later AMD's MI300, is a set of logic and memory dies married on a CoWoS interposer, with no other way to build them at volume. By 2023 the packaging step, not the chip printing or the memory, was the thing holding back GPU supply, and TSMC's roughly [120,000 CoWoS units](https://www.nextbigfuture.com/2024/02/why-is-there-a-shortage-of-nvidia-ai-chips.html) that year had to double toward 240,000 in 2024 and still ran short. The wafer can be printed in many places; the skill to wire and bond that interposer sits almost entirely in Taiwan.

