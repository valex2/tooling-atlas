---
Tags: tooling-card
Name: GNoME
Kind: Model
Tool: a neural net that predicts stable new crystals
Person: DeepMind's researchers
Place: London, England
Lat: 51.51
Lon: -0.13
City: London
Era: 2020s
Year: 2023
Goal: Both
Mechanism: Convergence
Confidence: Plausible
Unlocked: hundreds of thousands of new materials predicted at once
Significance: "GNoME trained a neural network on millions of computed materials to predict which never-made crystals would hold together, proposing about 380,000 stable ones in a single sweep, the materials twin of protein-structure prediction."
BuildsOn:
  - "[[Tooling Card - X-ray Crystallography]]"
  - "[[Tooling Card - Density Functional Theory]]"
  - "[[Tooling Card - The Deep-Learning Framework]]"
Threads:
  - "[[Thread - Machine Learning]]"
  - "[[Thread - Predict Before Building]]"
---
*Model · London, Britain · 2020s*
**DeepMind's researchers** · an AI that predicts new materials

**Front.** After a century of work, scientists had found only on the order of tens of thousands of stable inorganic crystals, each one a slow act of synthesis and testing. In 2023 a team at [DeepMind](https://deepmind.google/blog/millions-of-new-materials-discovered-with-deep-learning/) tried to short-circuit that. They treated each crystal as a graph, atoms for dots and bonds for lines, and [trained a neural network on the huge pile of materials whose stability had already been worked out by density functional theory](https://www.nature.com/articles/s41586-023-06735-9), until it could guess whether a crystal no one had ever made would hold together. Then they let it propose and sift millions of candidates. In one sweep it flagged [2.2 million structures, about 381,000 of them newly stable](https://www.nature.com/articles/s41586-023-06735-9), which the team called close to 800 years of normal discovery: not new chemistry but new scale, a model that guesses stability wholesale instead of one crystal at a time.

**Back.** It is the materials counterpart to predicting how a protein folds: guess the structure instead of grinding it out at the bench, and a [companion robot lab synthesized a first batch automatically](https://www.nature.com/articles/s41586-023-06735-9). The targets are batteries, catalysts, and superconductors, and the predictions poured into the open materials databases. It also closes a long loop: the crystal structures that X-ray crystallography spent a hundred years measuring became the data an AI learned to leap past. Today those 381,000 predicted crystals sit in public databases for any lab to pull from, though independent reviewers argue few have yet been confirmed at the bench.

