---
Tags: tooling-card
Name: ImageNet
Kind: Model
Tool: the labeled image dataset
Person: Fei-Fei Li
Place: Princeton, New Jersey, USA
Lat: 40.35
Lon: -74.66
City: Princeton
Era: 2009
Year: 2009
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: a shared benchmark for machine vision
Significance: "ImageNet gave the whole field a single yardstick with 14 million labeled images, making supervised learning competitive and setting up the 2012 AlexNet result that opened the deep learning era."
BuildsOn:
Enables:
  - "[[Tooling Card - AlexNet]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Model · Princeton and Stanford, USA · 2009*
**Fei-Fei Li** · the labeled image dataset

**Front.** In 2009 Fei-Fei Li and her team at Princeton and Stanford had a simple worry: computers could not learn to see because no one had given them enough labeled pictures. So they built a set. They gathered images off the web and paid crowd workers on Amazon Mechanical Turk to name what was in each one, [tens of thousands of people across 167 countries](https://en.wikipedia.org/wiki/ImageNet) sorting pictures into categories. The 2009 paper showed [3.2 million labeled images across 5,247 categories](https://www.sfu.ca/~kabhishe/posts/posts/summary_cvpr_imagenet_2009/); the finished set grew to [about 14 million images in 21,841 categories](https://en.wikipedia.org/wiki/ImageNet). The new thing was not a picture or a program. It was the labeled set itself, big enough to train on and shared by everyone, so for the first time the whole field had one yardstick for what counted as good.

**Back.** From 2010 they ran it as a yearly contest on a trimmed slice of [1,000 categories and about 1.28 million training images](https://en.wikipedia.org/wiki/ImageNet). In 2012 a network called AlexNet won it with a [15.3 percent error, more than 10 points better than anything else](https://en.wikipedia.org/wiki/ImageNet), and that result opened the way to the deep learning boom. The lesson stuck and the lead pooled: whoever owns the data shapes the model, so gathering and cleaning data became as prized as the machines that crunch it.

*Curator's note:* **(1) Placement.** Cell: Prototyping Tooling -> Models, sitting beside the other Model-kind cards rather than the Manufacturing moat cards. Goal: Both (it is a research benchmark and, later, a commercial means of production). Mechanism: Convergence, the shared yardstick everyone agreed to measure against. Confidence: high on every load-bearing number, all cross-checked across Wikipedia (citing ImageNet's own April-2010 stats), the SFU summary of the CVPR paper, and the Princeton publication record. Caveat: the famous 14M / 21,841 figure is the FULL dataset; the 2009 paper itself reported only 3.2M / 5,247, so the front states both rather than blurring them. This is one of a line of cards, not a standalone hero.

**(2) Analysis.** This card adds the idea that a dataset can be a tool, not just an input, and that curation is strategic work. It is the third leg that meets backprop and the GPU in the AlexNet story: the method, the compute, and the data all arriving at once. Pair it directly with the AlexNet card (the 2012 win is the collision point) and with whatever GPU/compute card carries the hardware leg. It also rhymes with the migration cards, because here the lead does not sit in the dataset itself (it was given away free) but POOLS downstream with whoever can gather and clean data at scale, much like leadership following the toolmaking in the Gauge card. In a parade reading, this card is the quiet setup and AlexNet is the payoff. Thread: [[Thread - Machine Learning]].

**(3) Nuance + sources.** The 2009 presentation was titled a preview of the dataset; the contest (ILSVRC) launched in 2010, so 2009 is correct for the dataset's debut but the benchmark-as-yardstick role hardened over the following years. Fei-Fei Li is consistently credited as the project's lead though the CVPR paper lists six authors (Deng, Dong, Socher, Li-Jia Li, Kai Li, Fei-Fei Li); the front names her as lead, which matches the standard account. Sources: [ImageNet, Wikipedia](https://en.wikipedia.org/wiki/ImageNet); [SFU summary of the 2009 CVPR paper](https://www.sfu.ca/~kabhishe/posts/posts/summary_cvpr_imagenet_2009/); [Princeton publication record](https://collaborate.princeton.edu/en/publications/imagenet-a-large-scale-hierarchical-image-database/). No figure rests on a single snippet; the disputed-feeling 14M number is the one most often misattributed to the 2009 paper, which is why the front separates the two.
