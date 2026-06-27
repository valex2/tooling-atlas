---
Tags: tooling-card
Name: The GPU
Kind: Make
Tool: the GPU and CUDA
Person: NVIDIA
Place: Santa Clara, California, USA
Lat: 37.35
Lon: -121.95
City: Santa Clara
Era: 1999-2012
Year: 2006
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: cheap parallel compute for deep learning
Significance: "CUDA turned gaming cards into cheap parallel computers, and that substrate is what let AlexNet cut image-recognition error by 11 points in 2012, concentrating AI leadership in whoever controlled the compute."
BuildsOn:
  - "[[Tooling Card - The Microprocessor]]"
Enables:
  - "[[Tooling Card - The Scaled-Up Language Model]]"
  - "[[Tooling Card - AlexNet]]"
  - "[[Tooling Card - The Deep-Learning Framework]]"
Threads:
  - "[[Thread - Electronic Switching]]"
  - "[[Thread - Machine Learning]]"
---
*Make · Santa Clara, California, USA · 1999-2012*
**NVIDIA** · the GPU and CUDA

**Front.** In October 1999, NVIDIA shipped a card for PC gamers and called it the [first GPU](https://en.wikipedia.org/wiki/GeForce_256): a single chip whose job was to draw the pixels of a video game. To do that it ran many small math units side by side, all grinding the same simple sum on different pixels at the same time. The chip could only be told to draw; if you wanted it to do other math, there was no door in. In November 2006 NVIDIA opened that door with [CUDA](https://en.wikipedia.org/wiki/CUDA), a way to write plain programs for those parallel units, shipped on a card with [128 cores](https://en.wikipedia.org/wiki/GeForce_8_series). What was new was not a faster chip but a cheap one with a thousand little workers, now turned loose on any math at all.

**Back.** That shape, many small units doing the same step over and over, is exactly the math a neural network needs to learn. In 2012, three researchers trained a network they called AlexNet on [two gaming cards in about six days](https://en.wikipedia.org/wiki/AlexNet) and beat the next-best entry by a wide margin, [15 percent top-5 error against its 26](https://en.wikipedia.org/wiki/AlexNet). The cards were the thing that made it possible, so the lead pooled in the compute rather than in the freely published math. NVIDIA rode it from a maker of game cards to the [first company on earth worth five trillion dollars](https://www.cnn.com/2026/02/07/business/nvidia-trillion-valuation-ai-chips-vis), and the door it opened in 2006 stayed its own.

*Curator's note:* **Placement.** Thread: Machine Learning (primary) and Electronic Switching. Goal: Both. Kind: Make. Mechanism: Convergence, with two faces here. First, the GPU is the universal compute substrate that all of deep learning converged onto. Second, CUDA is the durable moat: a software lock-in that kept the lead from leaking out to faster but harder-to-program chips. Year is fixed at 2006 (the CUDA unveiling) so the card sorts after the 1986 backprop card and before ImageNet 2009 and AlexNet 2012. Confidence: high on every load-bearing number. Caveat: "thousands of cores" is the modern figure; the 2006 launch card carried 128 unified cores, so the front says "a thousand little workers" and links the 128-core source rather than overclaiming for 1999-2006.

**Analysis.** This card supplies the missing third leg of the deep-learning story: the math (backprop) and the data (ImageNet) were not enough without cheap parallel compute to run them on. It runs two-way with the backprop card: backprop is the rule that needs this much arithmetic, and the GPU is the cheap arithmetic that made the rule pay off, the tool that turned a 1986 idea into a 2012 result. It sits naturally beside the AlexNet card, which is the first public proof the substrate worked. Cross-links to weave in: the GPU is the chip that comes after the microprocessor, so it extends [[Tooling Card - The Microcontroller]] and [[Tooling Card - The Microprocessor]] on [[Thread - Electronic Switching]]; it is itself manufactured on the light-printing fabs of [[Thread - Chip Lithography]], specifically [[Tooling Card - The EUV Machine]] and [[Tooling Card - The High-Yield Process Recipe]]. The throughline worth stating in the deck: this is the hinge where AI leadership becomes chip leadership, the same convergence-into-a-moat pattern as EUV, now stacked one layer up.

**Nuance + sources.** CUDA timing is the one place to be precise: NVIDIA publicly unveiled CUDA on November 8, 2006 alongside the GeForce 8800 GTX, but the CUDA 1.0 SDK did not ship until June 2007. I used the November 2006 unveiling as the card's "moment" and year, which matches the prompt's required 2006 and the chronological sort. The "world's first GPU" claim for the GeForce 256 (October 11, 1999) is NVIDIA's own marketing definition, not a neutral fact, and the front frames it that way ("called it"). AlexNet numbers cross-checked against the Wikipedia entry and the NeurIPS paper: two GTX 580 cards (3GB each), 90 epochs over five to six days, top-5 error 26.2 percent to 15.3 percent (front rounds to 26 and 15). NVIDIA crossed five trillion dollars on October 29, 2025 (the Feb 2026 CNN piece is a retrospective); it had earlier touched ~$3.5T in October 2024 and ~$4T in July 2025. No disputed figures; all body links are sources, every load-bearing number cross-checked against at least two of Wikipedia, the NeurIPS paper, and NVIDIA/press.
