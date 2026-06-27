---
Tags: tooling-card
Name: Backpropagation
Kind: Model
Tool: backpropagation
Person: Rumelhart, Hinton, and Williams
Place: San Diego, California, USA
Lat: 32.72
Lon: -117.16
City: San Diego
Era: 1986
Year: 1986
Goal: Both
Mechanism: Fragility
Confidence: Direct
Unlocked: machines that learn their own features
Significance: "Backpropagation gave neural networks a way to learn their own features from examples rather than hand-coded rules, but the method sat idle for 25 years until cheap GPUs made it practical, so the lead pooled in compute, not the equation."
Enables:
  - "[[Tooling Card - The Deep-Learning Framework]]"
  - "[[Tooling Card - AlexNet]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Model · San Diego and Pittsburgh, USA · 1986*
**Rumelhart, Hinton, and Williams** · backpropagation

**Front.** In 1986, three researchers wanted a machine to learn from examples on its own. David Rumelhart at San Diego, Geoffrey Hinton at Carnegie Mellon, and Ronald Williams had a network of simple units stacked in layers, but no good way to tell the inner layers how to fix their mistakes. In a four-page [Nature paper](https://www.nature.com/articles/323533a0) they wrote down a method: run the network forward, measure how wrong the answer was, then pass that error backward through the layers so each unit nudges its own connections a little. They called it back-propagation. The new thing was not a clever output. It was a way for a machine to find its own features from raw examples, instead of being handed rules by a person.

**Back.** The idea was free for anyone to copy, and for about 25 years it mostly sat still. The computers of the day were far too slow to train a large net, so the method looked like a curiosity. It caught fire only in 2012, when Hinton's students Alex Krizhevsky and Ilya Sutskever trained a deep net on two gaming [GPUs](https://en.wikipedia.org/wiki/AlexNet) for under a week and cut the [error rate on a big image contest](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks) by more than ten points over the next-best entry. The lead went not to whoever wrote the method but to whoever could afford the machines to run it, and the value pooled downstream in the compute.

*Curator's note:* **Placement.** Cell: Prototyping → Models. Goal: Both (capability and the cautionary lesson). Mechanism: Fragility — a free abstraction with no moat; the value waits downstream in the compute. Confidence: high on all load-bearing facts. Caveats: "back-propagation" was not invented from nothing in 1986 (see Nuance); the "~25 years" is a clean rounding of the 1986→2012 gap (26 years), so treat it as "about 25," not exact.

**Analysis.** This card adds the canonical example of an idea that is worthless until its tool arrives: the method was published, copyable, and then ignored for a quarter-century because no one could afford to run it at scale. It carries the thread cleanly, the back half of a two-way pairing with the GPU/CUDA card — the idea that waited (1986) versus the tool that freed it (2006). Read the two together and the lesson lands: leadership followed the silicon, not the equation. Cross-links: it rhymes with [[Tooling Card - The Bit]] (information theory) as a fellow free Model abstraction that confers prestige but no proprietary moat, the value pooling downstream in measurement and manufacturing rather than in the idea itself. Thread: The Learning Machine.

**Nuance + sources.** Roots predate 1986: Seppo Linnainmaa described the backward pass over chained operations in his 1970 master's thesis (no neural nets named), and Paul Werbos's 1974 Harvard PhD thesis was the first to propose using it to train neural networks. The 1986 Nature paper did not invent the math; it gave a clear, complete, learn-your-own-features framing that the field actually picked up, which is why it is the moment that stuck. I have flagged the priority dispute rather than papering over it. Primary/strong sources: Rumelhart, Hinton & Williams, *Nature* 323:533–536 (1986); Krizhevsky, Sutskever & Hinton, NeurIPS 2012 (AlexNet); Wikipedia (AlexNet, Paul Werbos) as backstop for the GPU/error-rate figures and the Linnainmaa/Werbos priority, each cross-checked against a second source.
