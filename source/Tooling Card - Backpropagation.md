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
Significance: "Backpropagation let neural networks learn their own features from examples instead of hand-coded rules. The method then sat idle for 25 years until cheap GPUs made it practical, so the lead pooled in compute, not the equation."
Enables:
  - "[[Tooling Card - The Deep-Learning Framework]]"
  - "[[Tooling Card - AlexNet]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Model · San Diego and Pittsburgh, USA · 1986*
**Rumelhart, Hinton, and Williams** · backpropagation

**Front.** In 1986, three researchers wanted a machine to learn from examples on its own. David Rumelhart at San Diego, Geoffrey Hinton at Carnegie Mellon, and Ronald Williams had a network of simple units stacked in layers, but no good way to tell the inner layers how to fix their mistakes. In a four-page [Nature paper](https://www.nature.com/articles/323533a0) they wrote down a method: run the network forward, measure how wrong the answer was, then pass that error backward through the layers so each unit nudges its own connections a little. They called it back-propagation. The new thing was not a clever output. It was a way for a machine to find its own features from raw examples, instead of being handed rules by a person.

**Back.** The idea was free for anyone to copy, and for about 25 years it mostly sat still. The computers of the day were far too slow to train a large net, so the method looked like a curiosity. It caught fire only in 2012, when Hinton's students Alex Krizhevsky and Ilya Sutskever trained a deep net on two gaming [GPUs](https://en.wikipedia.org/wiki/AlexNet) for under a week and cut the [error rate on a big image contest](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks) by more than ten points over the next-best entry. The lead went not to whoever wrote the method but to whoever could afford the machines to run it. The value pooled downstream in the compute.

