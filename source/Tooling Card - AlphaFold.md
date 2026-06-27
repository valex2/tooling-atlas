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

*Curator's note:* **Placement.** Model cell, London, 2020. Serves Goal 1 (knowing the chain of parts was never the same as knowing the folded shape; the program is the tool that finally crossed that gap) and Goal 2 (the model layer is where the moat re-forms at the top of the read-write-edit stack, with DeepMind and Google holding it). Mechanism: tagged Convergence, the reservoir here being machine-learning craft and compute built up elsewhere and turned on biology; but this is a Model, so the tag strains by design (see the home doc's "Models are the exception" rule) and the truer read is that the model itself is non-rival, freely released, while the moat lives one layer down in the training craft. Confidence: Direct, every load-bearing fact is multiply sourced (CASP14 2020, ~200M structures in 2022, the 2024 Nobel). **Analysis.** This is the capstone of [[Thread - Reading & Writing DNA]], the top of the rising stack where the moat climbs from the bench up to the AI layer, the same shape as [[Thread - Electronic Switching]]. It pairs against [[Tooling Card - The Wet-Fibre X-ray Camera]] (photograph the shape the slow way versus compute it), the deck's cleanest read-the-shape-twice rhyme across about seventy years. It also sits on [[Thread - Predict Before Building]] as the biology twin of the digital wind tunnel: compute eating biology's model layer the way CFD ate aerospace's test, find the answer on a screen instead of building and testing the real thing. Hero, not parade, because it carries the modern-frontier beat both threads end on. **Nuance.** The "fifty-year problem" and "solved" are the field's own words (Venki Ramakrishnan, widely quoted at CASP14), not a neutral measure; AlphaFold predicts a static folded shape, not how a protein moves or binds, so "solved" is shorthand. AlphaFold 2 (2020) is the version that won; the first AlphaFold (CASP13, 2018) was strong but not the breakthrough, so the card pins 2020. The ~200 million figure is the July 2022 release covering nearly all known proteins; the database launched in 2021 at a much smaller size. The 2024 Nobel split is real: Hassabis and Jumper for structure prediction, David Baker for protein design, so the back credits Baker's separate reverse-direction work rather than folding it into AlphaFold. Crediting two named leads compresses a large DeepMind team, the standard strain on a big-project card.
