---
Tags: tooling-card
Name: cuda-convnet
Kind: Make
Tool: a convolutional net trainer written in CUDA
Person: Alex Krizhevsky
Place: Toronto, Canada
City: Toronto
Lat: 43.65
Lon: -79.38
Era: 2011-2012
Year: 2012
Goal: Both
Mechanism: Pace-layers
Confidence: Direct
Unlocked: training one network across two graphics cards
Significance: "cuda-convnet was the hand-written CUDA program that trained a 60-million-number network across two 3GB gaming cards by cutting the network in half, and it was given away under a BSD license before the frameworks absorbed the job."
BuildsOn:
  - "[[Tooling Card - Backpropagation]]"
  - "[[Tooling Card - CUDA]]"
  - "[[Tooling Card - ImageNet]]"
  - "[[Tooling Card - The Neocognitron]]"
Enables:
  - "[[Tooling Card - AlphaGo]]"
  - "[[Tooling Card - ResNet]]"
  - "[[Tooling Card - The Deep-Learning Framework]]"
  - "[[Tooling Card - The Transformer]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Make · Toronto, Canada · 2011-2012*
**Alex Krizhevsky** · a convolutional net trainer written in CUDA

**Front.** By 2011 Alex Krizhevsky, a graduate student in Geoffrey Hinton's group at Toronto, had a program he had written for his own use. He called it [cuda-convnet](https://en.wikipedia.org/wiki/AlexNet), and it trained small image networks on one graphics card using CIFAR-10, a set of pictures 32 pixels on a side. Pointing it at ImageNet's million photographs broke it on a dull problem. The network he wanted held [60 million numbers and 650,000 neurons](https://www.image-net.org/static_files/files/supervision.pdf), and a GTX 580 card carried only 3 gigabytes of memory to hold them in. So he cut the network down the middle. He rewrote cuda-convnet to [run one half on each of two cards, splitting every layer but the last](https://en.wikipedia.org/wiki/AlexNet), and let the halves pass numbers to each other at a few chosen layers only, because the link between the two cards was the slow part. The whole program came to about [six thousand lines](https://github.com/computerhistory/AlexNet-Source-Code) of Python, C++ and CUDA, and it kept both cards busy by loading and cropping the next batch of pictures on the processor while the current batch was still training.

**Back.** Run this way for [ninety epochs over five or six days](https://en.wikipedia.org/wiki/AlexNet) on a machine in [his parents' house](https://computerhistory.org/blog/chm-releases-alexnet-source-code/), it got 15.3% of the contest images wrong where the next best entry got about 26%. Krizhevsky released the code under a [BSD license](https://en.wikipedia.org/wiki/AlexNet) so anyone could take it and change it, it gave other groups a working starting point for their own GPU network code, and in 2014 he wrote up [how to divide the work across cards](https://arxiv.org/abs/1404.5997). TensorFlow and PyTorch then did the same job in a few lines of Python, and the library fell out of use while [CUDA](https://en.wikipedia.org/wiki/CUDA), the layer it had been written against, kept every one of the users it had brought in.

