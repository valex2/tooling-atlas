---
Tags: tooling-card
Name: The Protein Data Bank
Kind: Model
Tool: one shared coordinate file for every solved protein
Person: Walter Hamilton and Edgar Meyer
Place: Upton, New York, USA
City: Upton
Lat: 40.87
Lon: -72.88
Era: 1970s
Year: 1971
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: every solved protein shape in one readable form
Significance: "Fixing every protein structure into one plain coordinate file turned fifty years of separate crystallography into a single pile a program could read, the pile AlphaFold trained on."
BuildsOn:
  - "[[Tooling Card - X-ray Crystallography]]"
  - "[[Tooling Card - The Punch Card]]"
Enables:
  - "[[Tooling Card - AlphaFold]]"
  - "[[Tooling Card - Generative Drug Design]]"
Threads:
  - "[[Thread - Predict Before Building]]"
  - "[[Thread - Machine Learning]]"
  - "[[Thread - The Open Reservoir]]"
---
*Model · Upton, New York, USA · 1970s*
**Walter Hamilton and Edgar Meyer** · one shared file for every protein shape

**Front.** In 1971 a solved protein shape sat in one lab as a box of punched cards, one card for each atom. [Myoglobin came to more than a thousand cards](https://pmc.ncbi.nlm.nih.gov/articles/PMC7340255/), and anyone who wanted it wrote to the group that had solved it and hoped for an answer. At a Cold Spring Harbor meeting that summer, crystallographers pressed [Walter Hamilton](https://www.rcsb.org/pages/about-us/history), who ran the chemistry department at Brookhaven, to hold the numbers in one place. Hamilton had already set [Edgar Meyer to work in 1969](https://en.wikipedia.org/wiki/Protein_Data_Bank) on software that wrote every structure out the same way: one atom to a line, [80 characters across](https://en.wikipedia.org/wiki/Protein_Data_Bank_(file_format)) because that was the width of a card, the atom's name and its three numbers always in the same columns. In [October 1971](https://journals.iucr.org/a/issues/2008/01/00/sc5004/index.html) Brookhaven and the Cambridge Crystallographic Data Centre announced the bank with [seven structures](https://www.rcsb.org/pages/about-us/history) on it and mailed copies out on magnetic tape. One lab's program could now read another lab's protein without touching the protein.

**Back.** Depositing stayed voluntary at first and plenty of groups held their numbers back. In 1989 the International Union of Crystallography wrote a rule that coordinates go in when the paper goes out, and the journals enforced it: [no deposition, no publication](https://pmc.ncbi.nlm.nih.gov/articles/PMC8826841/). The bank filled for fifty years, one hard-won structure at a time. In 2020 DeepMind trained AlphaFold 2 on [about 170,000 of those structures](https://www.nature.com/articles/s41592-021-01380-4), then in 2022 published [200 million computed shapes](https://deepmind.google/blog/alphafold-reveals-the-structure-of-the-protein-universe/) of its own, a thousand-fold more than the crystallographers had ever deposited. The bank is free to copy and stands at [256,840 measured structures](https://www.rcsb.org/pages/about-us/history), and it is still the only pile anyone can check a computed shape against.

