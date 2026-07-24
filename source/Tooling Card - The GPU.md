---
Tags: tooling-card
Name: The GPU
Kind: Make
Tool: the GeForce 256 graphics chip
Person: NVIDIA
Place: Santa Clara, California, USA
Lat: 37.35
Lon: -121.95
City: Santa Clara
Era: 1999-2001
Year: 1999
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: 3D geometry math on one cheap chip
Significance: "The GeForce 256 pulled the whole 3D pipeline onto a single die, moving geometry work off the main processor and off $75,000 workstations, and the rows of identical small math units it grew into became the cheapest arithmetic in computing."
BuildsOn:
  - "[[Tooling Card - CoWoS Advanced Packaging]]"
  - "[[Tooling Card - The Microprocessor]]"
Enables:
  - "[[Tooling Card - CUDA]]"
Threads:
  - "[[Thread - Electronic Switching]]"
  - "[[Thread - Machine Learning]]"
---
*Make · Santa Clara, California, USA · 1999-2001*
**NVIDIA** · one chip that draws a whole 3D scene

**Front.** Before 1999 a PC split the work of drawing a 3D scene in two. The main processor worked out where every corner of every shape sat in space and how much light fell on it, then handed a list of flat triangles to a graphics card that did nothing but fill in color. Doing that first half, the geometry, in hardware meant buying a [Silicon Graphics workstation](https://en.wikipedia.org/wiki/Geometry_pipelines) built around Jim Clark's geometry engine, and one of those could run [$75,000](https://www.hpcwire.com/2000/06/09/sgi-slashes-prices-on-silicon-graphics-workstations/). On 11 October 1999 NVIDIA shipped the [GeForce 256](https://en.wikipedia.org/wiki/GeForce_256), a single chip that carried a transform-and-lighting block and four pixel pipelines on the same die, [17 million transistors](https://en.wikipedia.org/wiki/GeForce_256) in 139 square millimeters, rated at ten million polygons a second.

**Back.** Geometry stopped being a machine you bought a desk for and became a part you bought off a shelf, and NVIDIA sold the same die to engineers as [Quadro](https://en.wikipedia.org/wiki/Nvidia_Quadro). 3dfx, whose Voodoo cards had defined PC 3D, shipped its Voodoo4 and Voodoo5 with the geometry still running on the main processor, fell behind on the benchmark everyone quoted, and [sold its graphics assets to NVIDIA in December 2000](https://en.wikipedia.org/wiki/3dfx) for $70 million and a million shares. The fixed block did not stay fixed. By 2001 the geometry stage on [NVIDIA's next chip](https://en.wikipedia.org/wiki/GeForce_3_series) ran small programs instead of one hard-wired routine, and each generation after that cut the die into more identical little math units. [Silicon Graphics](https://en.wikipedia.org/wiki/Silicon_Graphics), which had sold hardware geometry for fifteen years, filed for bankruptcy in 2006.

