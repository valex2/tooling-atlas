---
Tags: tooling-card
Name: The Hartree-Fock Method
Kind: Model
Tool: self-consistent field method
Person: Douglas Hartree (& Vladimir Fock)
Place: Manchester, UK
City: Manchester
Lat: 53.48
Lon: -2.24
Era: 1930s
Year: 1930
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: solving the many-electron atom one electron at a time
Significance: "Hartree's self-consistent field turned the unsolvable many-electron atom into a loop of one-electron problems, and with Fock's exchange term it became the first step of nearly all quantum chemistry."
BuildsOn:
  - "[[Tooling Card - Schrödinger's Wave Equation]]"
Enables:
  - "[[Tooling Card - Density Functional Theory]]"
Threads:
  - "[[Thread - Predict Before Building]]"
---
*Model · Manchester, UK · 1930s*
**Douglas Hartree (& Vladimir Fock)** · the atom that solves itself

**Front.** By the 1930s [Douglas Hartree](https://en.wikipedia.org/wiki/Douglas_Hartree) held the mathematics chair at Manchester and wanted to know where the electrons sit inside an atom. An atom like iron carries [26 electrons](https://en.wikipedia.org/wiki/Iron), and each one pushes on all the others, so the exact answer is a sum no one can solve. Hartree got around it with a loop he first printed in [1928](https://en.wikipedia.org/wiki/Hartree_equations): guess the shape of the whole electron cloud, solve [Schrödinger's equation](https://en.wikipedia.org/wiki/Schr%C3%B6dinger_equation) for just one electron feeling that guessed cloud, read off a better cloud, and feed it back in. He ran the loop over and over until the cloud he put in matched the cloud that came out, a [field that finally agreed with itself](https://en.wikipedia.org/wiki/Hartree%E2%80%93Fock_method).

**Back.** In [1930](https://en.wikipedia.org/wiki/Vladimir_Fock) a Soviet physicist in Leningrad, Vladimir Fock, added the piece Hartree had left out: because no two electrons can be told apart, swapping any two must flip the math, and that rule adds an extra ["exchange" pull](https://en.wikipedia.org/wiki/Exchange_interaction). With Fock's term bolted on it became the Hartree-Fock method, and Hartree's own father William spent his retirement [grinding the new sums by hand](http://users.wfu.edu/natalie/s20phy742/lecturenote/HartreeHartree1935.pdf), one atom at a time. The loop never went away: it is still the first step almost every quantum-chemistry program takes, and the mean-field idea inside it grew into [density functional theory](https://en.wikipedia.org/wiki/Density_functional_theory), the tool chemists now use to design molecules on a computer.

