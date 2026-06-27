---
Tags: tooling-card
Name: AlphaFold
Kind: Model
Tool: an AI that predicts protein shape
Person: Demis Hassabis and John Jumper
Place: London, England
Lat: 51.51
Lon: -0.13
City: London
Era: 2020s
Year: 2020
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: protein shape computed from its letters in hours
Significance: "AlphaFold replaced months of X-ray crystallography with hours of computation, putting the shapes of 200 million proteins online for free and moving the lead in structural biology to whoever can train the model."
BuildsOn:
  - "[[Tooling Card - X-ray Crystallography]]"
  - "[[Tooling Card - Cryo-EM]]"
  - "[[Tooling Card - The Deep-Learning Framework]]"
  - "[[Tooling Card - The Transformer]]"
Enables:
Threads:
  - "[[Thread - Reading & Writing DNA]]"
  - "[[Thread - Predict Before Building]]"
---
*Model · London, England · 2020s*
**Demis Hassabis and John Jumper** · an AI that guesses a protein's shape

**Front.** A protein is a long chain of small parts strung in a line, and the chain folds into one tight shape. The shape is what makes it work. For fifty years there was no way to look at the chain and know the shape it would fold into. You had to grow the protein into a crystal and shine X-rays through it, the slow hands-on way of [[Tooling Card - X-ray Crystallography]], the same family of trick that gave [[Tooling Card - The Wet-Fibre X-ray Camera|Photo 51]] its picture of DNA, and that could take [months or years for one protein](https://deepmind.google/discover/blog/alphafold-reveals-the-structure-of-the-protein-universe/). In 2020 a London team at DeepMind, led by [Demis Hassabis and John Jumper](https://deepmind.google/blog/demis-hassabis-john-jumper-awarded-nobel-prize-in-chemistry/), fed the chain into a trained program and let it guess the shape. At a contest called [CASP14](https://en.wikipedia.org/wiki/AlphaFold) their program, AlphaFold 2, guessed shapes so close to the real ones that judges called the [fifty-year problem](https://en.wikipedia.org/wiki/AlphaFold) solved. The new thing was not a sharper X-ray. It was a program that skipped the X-ray and computed the answer.

**Back.** The program does in hours what the bench took years to do, and once it worked DeepMind let everyone use it. In 2022 they put the guessed shapes for [almost every known protein online, around 200 million of them](https://deepmind.google/discover/blog/alphafold-reveals-the-structure-of-the-protein-universe/), free for anyone. Labs around the world picked it up, and in 2024 Hassabis and Jumper shared the [Nobel Prize in Chemistry](https://www.embl.org/news/science-technology/alphafold-wins-nobel-prize-chemistry-2024/) with David Baker, who used the same idea in reverse to design new proteins from scratch. The shape of a protein is now something you compute, not photograph, and the lead sits with the people who can train the program, not the people who run the X-rays.

