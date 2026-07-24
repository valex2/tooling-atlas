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
  - "[[Tooling Card - The Neocognitron]]"
Enables:
  - "[[Tooling Card - ResNet]]"
  - "[[Tooling Card - cuda-convnet]]"
Threads:
  - "[[Thread - Machine Learning]]"
  - "[[Thread - The Open Reservoir]]"
---
*Model · Princeton and Stanford, USA · 2009*
**Fei-Fei Li** · the labeled image dataset

**Front.** Computers could not learn to see, Fei-Fei Li argued in 2009, because no one had given them enough labeled pictures to learn from. So her team at Princeton and Stanford built a set. They gathered images off the web and paid crowd workers on Amazon Mechanical Turk to name what was in each one, [tens of thousands of people across 167 countries](https://en.wikipedia.org/wiki/ImageNet) sorting pictures into categories. The 2009 paper showed [3.2 million labeled images across 5,247 categories](https://www.sfu.ca/~kabhishe/posts/posts/summary_cvpr_imagenet_2009/); the finished set grew to [about 14 million images in 21,841 categories](https://en.wikipedia.org/wiki/ImageNet). The set itself was the tool, not any picture or program in it: big enough to train on, shared by everyone, so for the first time the whole field had one yardstick for what counted as good.

**Back.** From 2010 they ran it as a yearly contest on a trimmed slice of [1,000 categories and about 1.28 million training images](https://en.wikipedia.org/wiki/ImageNet). In 2012 a network called AlexNet won it with a [15.3 percent error, more than 10 points better than anything else](https://en.wikipedia.org/wiki/ImageNet), the result that set off the deep learning boom. Nobody owned the set, given away free; the advantage went to the firms that could amass and label data on this scale, the Googles and Metas whose pile of clean training data became as prized as the chips that crunch it.

