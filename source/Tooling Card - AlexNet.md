---
Tags: tooling-card
Name: AlexNet
Kind: Make
Tool: a deep net on two GPUs
Person: Krizhevsky, Sutskever, and Hinton
Place: Toronto, Canada
Lat: 43.65
Lon: -79.38
City: Toronto
Era: 2012
Year: 2012
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: deep learning on GPUs becomes the default
Significance: "AlexNet cut image-recognition error by 10 points over the field in 2012, proving that deep networks on consumer GPUs worked at scale and triggering nearly every serious lab to switch methods within a year."
BuildsOn:
  - "[[Tooling Card - The GPU]]"
  - "[[Tooling Card - Backpropagation]]"
  - "[[Tooling Card - ImageNet]]"
Enables:
  - "[[Tooling Card - The Transformer]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Make · Toronto, Canada · 2012*
**Krizhevsky, Sutskever, and Hinton** · a deep net on two GPUs

**Front.** In the fall of 2012, a graduate student named Alex Krizhevsky was working in Geoffrey Hinton's lab at the University of Toronto, alongside another student, Ilya Sutskever. They wanted to win a contest called ImageNet, where computers try to name what is in a photo. The best machines still got it wrong about a quarter of the time. Krizhevsky bought two [NVIDIA GTX 580 gaming cards](https://en.wikipedia.org/wiki/AlexNet), the kind built to draw video games, and spent about a week teaching a deep neural network on them, nudging its many small numbers toward the right answers by a method called backpropagation. None of the three parts was his invention. He had simply put them in one machine at once: the old way of learning, a cheap fast chip to run it on, and a giant pile of labeled pictures to learn from. That had never been done.

**Back.** Their network, later called AlexNet, did not just win. It got only [15.3% wrong where the next-best entry got 26.2% wrong](https://en.wikipedia.org/wiki/AlexNet), a gap the field had never seen. Within a year nearly every serious lab dropped what it was doing and switched to deep networks trained on gaming chips. Months later Hinton, Sutskever, and Krizhevsky sold their company to Google; today the large models that write, see, and code all trace to that week on two GTX 580s.

