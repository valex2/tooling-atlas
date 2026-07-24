---
Tags: tooling-card
Name: ResNet
Kind: Make
Tool: residual deep network
Person: Kaiming He (MSRA)
Place: Beijing, China
City: Beijing
Lat: 39.9
Lon: 116.41
Era: 2010s
Year: 2015
Goal: 2
Mechanism: Convergence
Confidence: Direct
Unlocked: networks hundreds of layers deep that actually train
Significance: "The skip connection let neural networks grow from twenty layers to hundreds, and every modern AI model still carries it."
BuildsOn:
  - "[[Tooling Card - Deep Belief Networks]]"
  - "[[Tooling Card - ImageNet]]"
  - "[[Tooling Card - LSTM]]"
  - "[[Tooling Card - The Neocognitron]]"
  - "[[Tooling Card - cuda-convnet]]"
Enables:
  - "[[Tooling Card - The Transformer]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Make · Beijing, China · 2010s*
**Kaiming He (MSRA)** · deep network with skip connections

**Front.** In 2015, [Kaiming He](https://en.wikipedia.org/wiki/Kaiming_He), a researcher at Microsoft's lab in Beijing, was stuck on a strange failure: neural networks were supposed to get smarter as they got deeper, but his team's [56-layer test network](https://arxiv.org/abs/1512.03385) made more mistakes than its own 20-layer copy. Somewhere in all those layers, the learning signal was fading out. So he and three colleagues wired a shortcut past every few layers, a bare connection that hands each block's input forward untouched, leaving the layers in between only a small correction to learn. With the shortcuts in place, depth stopped hurting: they trained a network [152 layers deep](https://www.microsoft.com/en-us/research/publication/deep-residual-learning-for-image-recognition/), eight times deeper than the previous year's best, and that December it [won the yearly ImageNet contest](https://www.image-net.org/challenges/LSVRC/2015/results.php), naming photos with 3.57 percent error where a careful human scores about [5.1](https://karpathy.github.io/2014/09/02/what-i-learned-from-competing-against-a-convnet-on-imagenet/).

**Back.** The paper and code went up for anyone to take, and the shortcut spread into nearly everything built since: DeepMind stacked forty of them into [the network that taught itself Go](https://www.nature.com/articles/nature24270), and every layer of the [transformers](https://arxiv.org/abs/1706.03762) behind today's chatbots carries one. In 2025 Nature named it the [most-cited paper of the twenty-first century](https://www.nature.com/articles/d41586-025-01125-9), counted as many as 254,000 times. The team itself split in 2016: Kaiming He left for Facebook in California, and the other three stayed in Beijing, running research at the face-recognition firm [Megvii](https://en.wikipedia.org/wiki/Megvii) and [co-founding](https://shaoqingren.com/) the self-driving startup Momenta. Beijing's vision firms rode the recipe for four years, until October 2019, when Washington put [Megvii on its export blacklist](https://kr-asia.com/chinese-tech-firm-megvii-faces-uncertain-future-in-global-ai-race).

