---
Tags: tooling-card
Name: Deep Belief Networks
Kind: Model
Tool: layer-wise pretrained network
Person: Geoffrey Hinton
Place: Toronto, Canada
City: Toronto
Lat: 43.65
Lon: -79.38
Era: 2000s
Year: 2006
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: deep neural networks that actually train
Significance: "A published recipe for training networks one layer at a time ended the neural-network winter, and because the recipe travelled freely the lead lived in the people, who moved to Google in 2013."
BuildsOn:
  - "[[Tooling Card - Backpropagation]]"
  - "[[Tooling Card - The Neocognitron]]"
Enables:
  - "[[Tooling Card - ResNet]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Model · Toronto, Canada · 2000s*
**Geoffrey Hinton** · deep network trained layer by layer

**Front.** In 2006, [Geoffrey Hinton](https://cifar.ca/bios/geoffrey-hinton/) was a computer science professor in Toronto who had spent thirty years on neural networks, an idea most of the field had quit; the money and the students had long since drifted elsewhere. He knew a network with many layers of simple units should beat a shallow one, but teaching all the layers at once never worked, because the correction signal faded to nothing before it reached the bottom. So he, his student Simon Osindero, and Yee-Whye Teh in Singapore [coded a way in from below](https://www.cs.toronto.edu/~fritz/absps/ncfast.pdf): teach the bottom layer alone until it can rebuild its own input, freeze it, let the next layer learn from the first layer's output, and stack upward like courses of brick, with one light pass of tuning at the end. Trained that way, a network of [1.7 million weights](https://direct.mit.edu/neco/article/18/7/1527/7065/A-Fast-Learning-Algorithm-for-Deep-Belief-Nets) finally learned, and read handwritten digits it had never seen with 1.25 percent error, edging out the best rival methods of the day.

**Back.** For six years the recipe lived inside a small circle that a [Canadian institute](https://cifar.ca/our-story/programs-through-the-years/) had been funding since 2004, back when almost nobody else would pay for neural-network research. Then in 2012 two of Hinton's students, Alex Krizhevsky and Ilya Sutskever, won the [ImageNet](https://en.wikipedia.org/wiki/AlexNet) picture-naming contest with a deep network, scoring 15.3 percent error where the runner-up scored 26.2, and the whole field turned around; by then cheap gaming chips and bigger data had made the layer-at-a-time trick itself unnecessary, and what remained was the proof that depth works. The lead moved south fast: [Google bought](https://www.cbc.ca/news/science/google-buys-university-of-toronto-startup-1.1373641) the three-man company Hinton formed with those two students in 2013, and the students moved to Mountain View.

