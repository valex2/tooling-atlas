---
Tags: tooling-card
Name: The Measure Station
Kind: Measure
Tool: a second station inside the scanner that only measures
Person: Martin van den Brink
Place: Veldhoven, Netherlands
City: Veldhoven
Lat: 51.42
Lon: 5.41
Era: 2000s
Year: 2001
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: chip layers stacked to within a nanometre
Significance: "By giving the scanner a second station whose only job is to measure the wafer, ASML made measurement free and turned overlay from a throughput cost into the thing its machines were best at."
BuildsOn:
  - "[[Tooling Card - The Wafer Stepper]]"
  - "[[Tooling Card - The Laser]]"
Enables:
  - "[[Tooling Card - Immersion Lithography]]"
  - "[[Tooling Card - The EUV Machine]]"
Threads:
  - "[[Thread - Chip Lithography]]"
  - "[[Thread - Precision Optics]]"
  - "[[Thread - Measure and Correct]]"
---
*Measure · Veldhoven, Netherlands · 2000s*
**Martin van den Brink** · a station inside the scanner that only measures

**Front.** In 2000 [Martin van den Brink](https://www.asml.com/en/technology/how-we-innovate/fellows/martin-van-den-brink) was running machine development at [ASML in Veldhoven](https://fab.cba.mit.edu/classes/865.24/topics/mechanical_design/mechanical_design/precision-frontier/performance-results-of-300mm-litho.pdf), and every scanner his group built had to give up chips to stay accurate. Before a machine can print a chip layer it has to find the wafer, and it finds it by reading small grating marks etched into the layer underneath. Read more marks and the pattern lands better. Read more marks and the machine makes fewer chips an hour, so fabs settled for two marks a wafer and lived with the error. The [TWINSCAN that shipped in 2001](https://www.asml.com/en/news/stories/2021/twinscan-20-years-innovation) carried two wafer stages and a second spot inside itself that prints nothing at all. At that spot an [ATHENA sensor](https://fab.cba.mit.edu/classes/865.24/topics/mechanical_design/mechanical_design/precision-frontier/performance-results-of-300mm-litho.pdf) shines two colours onto the marks and reads seven orders of the light they bend back, while a nine-spot level sensor crawls the wafer and builds a height map of the whole surface, each spot reading a patch about 2.8 by 2.5 millimetres. All of it runs while the other stage is under the lens. Measuring had stopped costing anything, so a wafer could be read at [twenty-five marks instead of two](https://fab.cba.mit.edu/classes/865.24/topics/mechanical_design/mechanical_design/precision-frontier/performance-results-of-300mm-litho.pdf) for free.

**Back.** Knowing the wafer that well meant the machine could correct for it, and layers began landing on the ones beneath them far more exactly: [about 10 nanometres](https://fab.cba.mit.edu/classes/865.24/topics/mechanical_design/mechanical_design/precision-frontier/performance-results-of-300mm-litho.pdf) of overlay on those first dual-stage systems, [around 1 nanometre](https://www.asml.com/en/news/stories/2021/twinscan-20-years-innovation) on the immersion machines running today at 295 wafers an hour. Nikon did not ship a two-stage immersion scanner of its own until [late 2009](https://www.nikon.com/company/news/2008/1112_nsr_01/), eight years behind. Every immersion and EUV machine ASML has built since rides the same two-stage platform, so every advanced chip in the world is now measured before it is printed, its wafer stage tracked [20,000 times a second by sensors good to about 60 picometres](https://www.asml.com/en/technology/lithography-principles/mechanics-and-mechatronics).

