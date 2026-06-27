---
Tags: tooling-card
Name: The Deep-Learning Framework
Kind: Model
Tool: the deep-learning framework
Person: Google (TensorFlow) and Meta (PyTorch)
Place: Mountain View, California, USA
Lat: 37.39
Lon: -122.08
City: Mountain View
Era: 2015-2017
Year: 2015
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: building neural nets in plain Python
Significance: "TensorFlow and PyTorch let an ordinary programmer build a neural net in a few lines of Python without touching the chip, becoming the free floor every modern AI model is built on."
BuildsOn:
  - "[[Tooling Card - Backpropagation]]"
  - "[[Tooling Card - Unix and C]]"
  - "[[Tooling Card - The GPU]]"
Enables:
  - "[[Tooling Card - Generative Drug Design]]"
  - "[[Tooling Card - AlphaFold]]"
  - "[[Tooling Card - The Scaled-Up Language Model]]"
  - "[[Tooling Card - GNoME]]"
Threads:
  - "[[Thread - Machine Learning]]"
  - "[[Thread - Software Abstraction]]"
---
*Model · Mountain View and Menlo Park, California, USA · 2015-2017*
**Google (TensorFlow) and Meta (PyTorch)** · the deep-learning framework

**Front.** In 2012, Alex Krizhevsky won the big image contest with a neural net, and to build it he wrote about [six thousand lines](https://github.com/computerhistory/AlexNet-Source-Code) of raw CUDA code by hand, talking to the graphics chips one instruction at a time. There was no tool for this; you taught yourself the chip or you did not train a net. On November 9, 2015, Google gave away [TensorFlow](https://opensource.googleblog.com/2015/11/tensorflow-googles-latest-machine.html) as free, open software, and a Meta team led by Soumith Chintala put out PyTorch the same way in [January 2017](https://en.wikipedia.org/wiki/PyTorch). Now you wrote your model in a few lines of plain Python and the framework did the rest: it ran the math on the graphics chip for you, and it worked out the calculus of learning on its own. The new thing was not any one model. It was a tool that let an ordinary programmer build a neural net without ever touching the chip.

**Back.** This is what let the field run. Every large model since is built this way: a few lines describing the net, a framework underneath, graphics chips doing the work. The big labs picked it up at once, and the open frameworks became the floor everyone stood on, from the protein model [AlphaFold](https://www.nature.com/articles/s41586-021-03819-2) to the chat models. Because the frameworks were free and open, they held no fence of their own. The lead stayed below them in the chips and above them in the models, the same way it had with the older free software.

*Curator's note:* **Placement.** Cell: Prototyping → Models (Mechanism Convergence). Goal: Both. Confidence: high on the dated facts (TensorFlow open-sourced Nov 9 2015; PyTorch public release Jan 2017), high on the mechanism.

**Analysis.** This card is the software hinge of the Machine Learning stack: it takes the hand-written CUDA world of 2012 and turns model-building into ordinary Python. What it adds over a bare "GPU" card is the *abstraction layer* — automatic differentiation plus a Python-to-GPU compile path — that made deep learning a tool a non-specialist could pick up. It bridges the Portable Software island into the Machine Learning stack: the framework is written in and runs on [[Tooling Card - Unix and C]] and targets [[Tooling Card - The GPU]], so it literally carries the Unix/C lineage into modern AI. Downstream it enables [[Tooling Card - The Scaled-Up Language Model]] (ChatGPT) and [[Tooling Card - AlphaFold]]. The convergence-without-moat shape rhymes with [[Tooling Card - Unix and C]] and the Transformer: a universal open tool whose value pools elsewhere. Threads: Portable Software, Machine Learning.

**Nuance + sources.** One real date correction: the prompt says PyTorch "followed in 2016," but development began in 2016 and the public release was January 19, 2017 ([Wikipedia](https://en.wikipedia.org/wiki/PyTorch), corroborated by the pytorch/pytorch repo history). I wrote 2017 in the body; flag this if the deck wants the 2016 framing. Second nuance: AlphaFold runs primarily on [JAX](https://www.nature.com/articles/s41586-021-03819-2) (with TensorFlow/Sonnet as dependencies), not plain TensorFlow, so I kept the body's framework claim general ("built this way") rather than naming TensorFlow for AlphaFold. AlexNet's ~6,000 lines of hand-written CUDA: [Computer History Museum source release](https://github.com/computerhistory/AlexNet-Source-Code). TensorFlow date: [Google Open Source blog, Nov 9 2015](https://opensource.googleblog.com/2015/11/tensorflow-googles-latest-machine.html).
