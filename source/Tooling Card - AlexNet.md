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

**Front.** In the fall of 2012, a graduate student named Alex Krizhevsky was working in Geoffrey Hinton's lab at the University of Toronto, alongside another student, Ilya Sutskever. They wanted to win a contest called ImageNet, where computers try to name what is in a photo, and the best machines still got it wrong about a quarter of the time. Krizhevsky bought two [NVIDIA GTX 580 gaming cards](https://en.wikipedia.org/wiki/AlexNet), the kind built to draw video games, and spent about a week teaching a deep neural network on them, nudging its many small numbers toward the right answers by a method called backpropagation. None of the three parts was new. What was new was that they finally came together in one machine: the old way of learning, a cheap fast chip to run it on, and a giant pile of labeled pictures to learn from.

**Back.** Their network, later called AlexNet, did not just win. It got only [15.3% wrong where the next-best entry got 26.2% wrong](https://en.wikipedia.org/wiki/AlexNet), a gap the field had never seen. Within a year nearly every serious lab dropped what it was doing and switched to deep networks trained on gaming chips. The lead did not die or move on. It compounded: this is the hinge the whole modern story of artificial intelligence swings on, the moment the method, the chips, and the data met.

*Curator's note:* **Placement.** Cell: Make / Convergence. Goal: Both (it is a model *and* the proof that GPUs are AI's compute). Mechanism: convergence — the three-way collision of method (backpropagation), compute (the consumer GPU), and data (ImageNet). Confidence: high. Every load-bearing number is cross-checked across Wikipedia, ImageNet's own site, the NeurIPS paper as relayed by CACM, and multiple secondary writeups, with no conflicts. Role: Hero / keystone of the thread "The Learning Machine." Caveats below.

**Analysis.** This is the parade's hero card and the thread's hinge — the single moment where three separately matured tools finally fire together. It adds the payoff that the three feeder cards have been setting up, so it must be read *after* them. Cross-links to mesh it in: it cashes out the **backprop card** (the method, here finally run at scale), proves the **GPU/CUDA card** (consumer gaming silicon becomes AI's compute, the claim that card promises is settled here), and consumes the **ImageNet card** (the labeled-data pile that made supervised learning bite). It then sets up the **Transformer card** as the next link — once deep nets on GPUs win, the question becomes what architecture to scale, and attention answers it. Pair it directly with the GPU card as a hero/feeder couplet: the GPU card builds the chip, this card shows what the chip was for. Hinton, Sutskever, and Krizhevsky also seed a people-thread (they sold their company to Google months later; Sutskever later co-founds OpenAI) if the deck wants a downstream human arc.

**Nuance + sources.** The runner-up gap is stated two ways across sources — 10.8 vs 10.9 points (15.3 vs 26.2) — a rounding artifact, not a dispute; I gave the two raw error rates and let the reader subtract. Parameter count (~60M) and neuron count vary slightly by source (650,000 neurons per Wikipedia, ~500,000 in some paper summaries); I used only the robust 60M figure in the curator, not the body. Training time is reported as "five to six days," which I rendered as "about a week" — faithful and plainer. The team competed as "SuperVision" and submitted on Sept 30, 2012, on the ILSVRC-2012 set; "ImageNet contest" in the body is the plain-register name. The idea that AlexNet *invented* CNNs or backprop would be wrong and the card is careful not to claim it — the whole point is collision, not invention (LeCun's LeNet and the backprop lineage predate it; that is the feeder cards' territory). Sources: [Wikipedia: AlexNet](https://en.wikipedia.org/wiki/AlexNet), [ImageNet / SuperVision paper PDF](https://www.image-net.org/static_files/files/supervision.pdf), [CACM reprint of the NeurIPS 2012 paper](https://cacm.acm.org/magazines/2017/6/217745-imagenet-classification-with-deep-convolutional-neural-networks/fulltext).
