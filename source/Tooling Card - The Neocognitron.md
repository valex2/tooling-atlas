---
Tags: tooling-card
Name: The Neocognitron
Kind: Model
Tool: convolutional neural network
Person: Kunihiko Fukushima
Place: Tokyo, Japan
City: Tokyo
Lat: 35.68
Lon: 139.69
Era: 1980s
Year: 1980
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: recognizing a shape no matter where it sits
Significance: "Fukushima stacked feature-detecting and pooling layers into the first convolutional network in 1980, giving a machine a way to spot a shape wherever it appears, but the payoff waited decades for backpropagation, data, and fast chips that arrived elsewhere."
Enables:
  - "[[Tooling Card - Deep Belief Networks]]"
  - "[[Tooling Card - ImageNet]]"
  - "[[Tooling Card - ResNet]]"
  - "[[Tooling Card - cuda-convnet]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Model · Tokyo, Japan · 1980s*
**Kunihiko Fukushima** · stacked feature-and-pooling layers

**Front.** In the late 1970s, [Kunihiko Fukushima](https://fi.edu/en/awards/laureates/kunihiko-fukushima), an engineer at Japan's public broadcaster NHK in Tokyo, wanted a machine that could read a handwritten number no matter where on the page it landed. The reading machines of the day failed the moment a digit slid an inch to the side. So he built a network in software from two kinds of made-up cells he borrowed from [the cat's eye](https://en.wikipedia.org/wiki/Neocognitron): one kind stared at a tiny patch and fired when it caught a simple mark like an edge, and above it a second kind watched a wider patch and fired if that mark showed up anywhere inside it. He piled the pair one atop the other, over and over, and in [1980](https://link.springer.com/article/10.1007/BF00344251) laid the whole thing out in a paper he called the Neocognitron. It taught itself its own marks with no one labeling anything, and it knew a shape wherever the shape sat.

**Back.** Fukushima trained his network without backpropagation, the trick that later made such networks easy to teach, so for years it stayed a quiet curiosity. In 1989 [Yann LeCun](https://en.wikipedia.org/wiki/Yann_LeCun) at Bell Labs in New Jersey took the same stacked layers, taught them by backpropagation, and built [LeNet](https://en.wikipedia.org/wiki/LeNet), which by the mid-1990s was reading the amount on more than one in ten of all paper checks in the United States. The same design, grown huge and run on gaming chips, won the [2012 ImageNet contest](https://en.wikipedia.org/wiki/AlexNet) and set off the deep-learning boom, so the shape Fukushima first drew in Tokyo paid off decades later in New Jersey and Toronto.

