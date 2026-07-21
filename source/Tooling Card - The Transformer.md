---
Tags: tooling-card
Name: The Transformer
Kind: Model
Tool: the Transformer
Person: Vaswani and seven others (Google)
Place: Mountain View, California, USA
Lat: 37.39
Lon: -122.08
City: Mountain View
Era: 2017
Year: 2017
Goal: Both
Mechanism: Fragility
Confidence: Direct
Unlocked: the architecture under every modern AI model
Significance: "Google published the Transformer freely in 2017, handing the whole industry an architecture that scales with compute. The lead then pooled not in the design but in whoever could afford the largest clusters to run it."
BuildsOn:
  - "[[Tooling Card - cuda-convnet]]"
Enables:
  - "[[Tooling Card - AlphaFold]]"
  - "[[Tooling Card - The Scaled-Up Language Model]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Model · Mountain View, California, USA · 2017*
**Vaswani and seven others (Google)** · the Transformer

**Front.** In 2017 eight researchers at Google were trying to make machine translation faster. The models of the day read a sentence one word at a time, each step waiting on the one before it, which made them slow to train and hard to grow. The eight wrote a [nine-page paper](https://arxiv.org/abs/1706.03762) describing a design that threw out the waiting: it read every word of a sentence at once and learned which words to pay attention to. It [trained in 3.5 days on eight GPUs](https://arxiv.org/abs/1706.03762) where older models took far longer. The shape had no built-in ceiling, so it [kept getting better the bigger you made it and the more text and compute you fed it](https://arxiv.org/abs/2001.08361).

**Back.** That shape, the Transformer, made a new kind of model possible: train it on a mountain of text, then ask it anything. Google published the paper and patented nothing, so anyone could build on it. Within a year OpenAI built [its first GPT](https://en.wikipedia.org/wiki/GPT-1) on the same design. The architecture traveled free, fast as a download, and held no ground of its own; the chips and giant clusters needed to train and run it at scale did. Five years on, the [chatbot built on it reached 100 million users in two months](https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/), the fastest any product had.

