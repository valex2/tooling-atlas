---
Tags: tooling-card
Name: CUDA
Kind: Make
Tool: a C compiler that aims plain code at a graphics card
Person: Ian Buck and John Nickolls
Place: Santa Clara, California, USA
City: Santa Clara
Lat: 37.35
Lon: -121.95
Era: 2006-2007
Year: 2006
Goal: Both
Mechanism: Pace-layers
Confidence: Direct
Unlocked: ordinary C code running on a graphics card
Significance: "CUDA let a programmer aim plain C at the thousands of small math units on a graphics card without disguising the numbers as pictures, and the pile of code written against it since is why a rival's faster chip cannot simply be swapped in."
BuildsOn:
  - "[[Tooling Card - The GPU]]"
  - "[[Tooling Card - Unix and C]]"
Enables:
  - "[[Tooling Card - cuda-convnet]]"
  - "[[Tooling Card - The Deep-Learning Framework]]"
  - "[[Tooling Card - The Scaled-Up Language Model]]"
Threads:
  - "[[Thread - Machine Learning]]"
  - "[[Thread - Software Abstraction]]"
---
*Make · Santa Clara, California, USA · 2006-2007*
**Ian Buck and John Nickolls** · a C compiler aimed at a graphics card

**Front.** Around 2000 a graduate student in Stanford's graphics lab, [Ian Buck](https://developer.nvidia.com/blog/inside-the-programming-evolution-of-gpu-computing/), kept noticing that a gaming card ran the same tiny program on a million pixels sixty times a second and that most of those programs were just arithmetic. Getting it to do arithmetic he chose was the hard part. The only door in was the drawing pipe, so to add two long lists of numbers you [stored the lists as a texture, wrote a short program that pretended to color pixels, drew a rectangle over the screen, and read the picture back](https://graphics.stanford.edu/papers/brookgpu/brookgpu.pdf). Buck wrote a language called [Brook](https://dl.acm.org/doi/10.1145/1186562.1015800) to hide that bookkeeping, NVIDIA hired him in 2004 and sat him with John Nickolls, and on 8 November 2006 the two shipped [CUDA](https://en.wikipedia.org/wiki/CUDA) alongside the 128-unit GeForce 8800 GTX. You wrote ordinary C, marked one function with an extra word to say it belonged on the card, and a compiler called nvcc cut the file in two and sent each half where it went. Threads could now [read and write any address they liked and share a small fast patch of memory right on the chip](https://en.wikipedia.org/wiki/CUDA), so a group of them could pass numbers to each other and never touch a picture at all.

**Back.** The toolkit went up as a [free download in February 2007](https://en.wikipedia.org/wiki/CUDA) and the people who came for it first were chemists and physicists with simulations that had been queued on shared machines for years. In 2011 a student in Toronto, Alex Krizhevsky, [hand-wrote his image-recognition network in CUDA and C++](https://computerhistory.org/blog/chm-releases-alexnet-source-code/) and trained it on two gaming cards in his bedroom at his parents' house, and after [AlexNet](https://en.wikipedia.org/wiki/AlexNet) won, the frameworks that followed stopped talking to the chip at all and called NVIDIA's CUDA libraries instead. Jensen Huang counted [five million CUDA developers](https://www.marketscreener.com/quote/stock/NVIDIA-CORPORATION-57355629/news/TAIPEI-NVIDIA-CEO-HUANG-WE-NOW-HAVE-5-MILLION-CUDA-DEVELOPERS-A--46882472/) by mid-2024. The chips underneath were replaced every couple of years and the code above them stayed, which is why [AMD's answer, ROCm](https://www.theregister.com/2024/12/17/nvidia_cuda_moat/), is built to read CUDA rather than to replace it.

