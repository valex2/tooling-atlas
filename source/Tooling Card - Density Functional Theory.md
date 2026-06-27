---
Tags: tooling-card
Name: Density Functional Theory
Kind: Model
Tool: compute a material from its electron density
Person: Walter Kohn
Place: San Diego, California, USA
Lat: 32.72
Lon: -117.16
City: San Diego
Era: 1960s
Year: 1965
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: a material's properties calculated, not measured
Significance: "Density functional theory made it possible to calculate a material's properties from the quantum behavior of its electrons, turning materials science from wet-lab trial and error into something you can compute."
Enables:
  - "[[Tooling Card - GNoME]]"
Threads:
  - "[[Thread - Predict Before Building]]"
---
*Model · San Diego, USA · 1960s*
**Walter Kohn** · a material computed from its electron cloud

**Front.** To predict what a material will do, in principle you solve the quantum equation for its electrons. But the [full wavefunction depends on the positions of every electron at once](https://physicstoday.aip.org/features/a-half-century-of-density-functional-theory), so even a handful of them makes the sum hopeless. In 1964 the physicist [Walter Kohn](https://cen.acs.org/articles/94/web/2016/04/Chemistry-Nobel-laureate-Walter-Kohn.html), with Pierre Hohenberg, proved a surprising shortcut: everything about a material's lowest-energy state is fixed by just the [electron density](https://physics.aps.org/story/v2/st19), a far simpler thing, namely how thick the electron cloud is at each point in space. The next year, with Lu Sham, he turned that proof into a [recipe a computer could actually run](https://link.springer.com/article/10.1007/s11224-023-02147-7). The new thing was a way to calculate a real material from quantum mechanics without ever solving the impossible equation.

**Back.** The method sat underused until the 1980s, when good enough approximations made it practical, and then it became the [most widely used calculation in all of chemistry and materials science](https://link.springer.com/article/10.1007/s11224-023-02147-7), winning Kohn the [Nobel Prize in 1998](https://physics.aps.org/story/v2/st19). With it you could predict a material's structure, strength, and behavior on a computer before anyone made it, which is how batteries, catalysts, and alloys are now screened. It turned "find a material, then test it" toward "compute a material, then make it." Decades on, the millions of calculations it produced became the training data an AI learned to leap past.

