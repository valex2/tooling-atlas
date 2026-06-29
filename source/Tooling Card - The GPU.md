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

**Front.** In October 1999, NVIDIA shipped a card for PC gamers and called it the [first GPU](https://en.wikipedia.org/wiki/GeForce_256): a single chip whose job was to draw the pixels of a video game. To do that it ran many small math units side by side, all grinding the same simple sum on different pixels at the same time. The chip could only be told to draw; if you wanted it to do other math, there was no door in. In November 2006 NVIDIA opened that door with [CUDA](https://en.wikipedia.org/wiki/CUDA), a way to write plain programs for those parallel units, shipped on a card with [128 cores](https://en.wikipedia.org/wiki/GeForce_8_series). It was not a faster chip but a cheap one with a thousand little workers, now turned loose on any math at all.

**Back.** That shape, many small units doing the same step over and over, is exactly the math a neural network needs to learn. In 2012, three researchers trained a network they called AlexNet on [two gaming cards in about six days](https://en.wikipedia.org/wiki/AlexNet) and beat the next-best entry by a wide margin, [15 percent top-5 error against its 26](https://en.wikipedia.org/wiki/AlexNet). The math was published for anyone; the cards that ran it were not, and CUDA kept the work locked to NVIDIA's silicon even as faster but harder-to-program chips appeared. NVIDIA rode it from a maker of game cards to the [first company on earth worth five trillion dollars](https://www.cnn.com/2026/02/07/business/nvidia-trillion-valuation-ai-chips-vis).

