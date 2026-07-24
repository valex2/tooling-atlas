---
Tags: tooling-card
Name: The de Casteljau Algorithm
Kind: Model
Tool: recursive curve evaluation
Person: Paul de Casteljau
Place: Paris, France
City: Paris
Lat: 48.85
Lon: 2.35
Era: 1950s
Year: 1959
Goal: 1
Mechanism: Fragility
Confidence: Direct
Unlocked: smooth freeform curves from a few movable points
Significance: "The recursion that draws every Bézier curve was worked out at Citroën in 1959 and stamped secret, so the curves took the name of the rival at Renault who published."
Enables:
  - "[[Tooling Card - UNISURF]]"
Threads:
  - "[[Thread - Prototyping & CAD]]"
---
*Model · Paris, France · 1950s*
**Paul de Casteljau** · curves by repeated averaging

**Front.** In 1959 a young mathematician named [Paul de Casteljau](https://en.wikipedia.org/wiki/Paul_de_Casteljau), a year into his first job at [Citroën](https://arxiv.org/abs/2408.13125) in Paris, was asked to turn the body of a car, still shaped by hand in clay, into numbers the machines cutting the steel press dies could follow. No known equation fit those shapes. So he wrote a [recipe](https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm) of plain arithmetic: put down a few guide points he called poles, step the same fraction of the way along each straight line between them, connect the new points, and do it again until a single point remains. That point lands exactly on a smooth curve; move one pole and the whole curve follows, so a stylist's shape became a short list of numbers. Citroën took his report, ["Outillage méthodes calcul"](https://arxiv.org/abs/2408.13125), and stamped it secret.

**Back.** Citroën kept the recipe locked up for [fifteen years](https://en.wikipedia.org/wiki/Paul_de_Casteljau). Across town at Renault, [Pierre Bézier](https://en.wikipedia.org/wiki/Pierre_B%C3%A9zier) worked out the same curves on his own and published, then machined parts with them in his [UNISURF](https://en.wikipedia.org/wiki/UNISURF) system, so every textbook and every drawing program calls them Bézier curves. When the Citroën reports surfaced in the mid-1970s, [Wolfgang Boehm](https://dl.acm.org/doi/10.1016/j.cagd.2024.102366) put de Casteljau's name on the recipe, which is still how a computer splits and draws the curves in every font on this screen. In [2012](http://solidmodeling.org/awards/bezier-award/paul-de-faget-de-casteljau/) the field handed the retired mathematician its highest prize, an award named after Bézier.

