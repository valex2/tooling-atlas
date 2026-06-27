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

