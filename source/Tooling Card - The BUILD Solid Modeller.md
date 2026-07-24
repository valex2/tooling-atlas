---
Tags: tooling-card
Name: The BUILD Solid Modeller
Kind: Model
Tool: solid geometry kernel
Person: Ian Braid (Cambridge)
Place: Cambridge, UK
City: Cambridge
Lat: 52.2
Lon: 0.12
Era: 1970s
Year: 1973
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: parts held as true solids inside the computer
Significance: "BUILD modelled a part as a closed solid rather than a drawing, founding the boundary-representation kernel line (ROMULUS, Parasolid, ACIS) that still runs inside most of the world's CAD."
BuildsOn:
  - "[[Tooling Card - Sketchpad]]"
Enables:
  - "[[Tooling Card - CATIA]]"
Threads:
  - "[[Thread - Prototyping & CAD]]"
---
*Model · Cambridge, UK · 1970s*
**Ian Braid (Cambridge)** · a program that holds true solids

**Front.** In 1973, a research student at Cambridge named [Ian Braid](http://solidmodeling.org/awards/bezier-award/i-braid-a-grayer-and-c-lang/) was finishing [a thesis](https://catalogue.nla.gov.au/Record/2151118) on a nagging gap in computer drawing: the machine could show a metal part as lines on a screen, but it could not tell which side of a line was metal and which was air, so it could not say what the part weighed or whether one hole broke into another. Braid wrote a program he called BUILD, in which a designer shaped a part out of [six plain solids](https://dl.acm.org/doi/10.1145/360715.360727) (a cube, a wedge, a cylinder and their kin), adding one, cutting another away, while the program kept a ledger of every face, every edge, and which side of each was inside. At the end the computer held not a picture of the part but the part itself, closed all the way round. It could answer questions no drawing could.

**Back.** A year later Braid and three colleagues [set up a company](https://en.wikipedia.org/wiki/Shape_Data_Limited) in Cambridge to sell the idea, and in 1978 their [ROMULUS](https://en.wikipedia.org/wiki/Romulus_(modelling_kernel)) became the first solid-modelling engine other firms could license and build their own design programs on. Its rewrite, [Parasolid](https://www.siemens.com/en-us/products/plm-components/parasolid/), shipped in 1988 and today runs inside SolidWorks, Siemens NX, and more than [350 other design programs](https://www.cadinterop.com/en/formats/neutral-format/parasolid.html); Braid, Charles Lang and Alan Grayer meanwhile wrote the rival engine [ACIS](https://en.wikipedia.org/wiki/ACIS), released in 1989 and named, by the common account, for Alan, Charles and Ian. Nearly every solid part designed on a computer since passes through one of those two engines, and both grew out of the same few streets in Cambridge.

