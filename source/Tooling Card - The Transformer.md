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
Significance: "Google published the Transformer architecture freely in 2017, giving the entire industry the shape that scales with compute, so the lead pooled not in the design but in whoever could afford the largest clusters to run it."
BuildsOn:
  - "[[Tooling Card - AlexNet]]"
Enables:
  - "[[Tooling Card - AlphaFold]]"
  - "[[Tooling Card - The Scaled-Up Language Model]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Model · Mountain View, California, USA · 2017*
**Vaswani and seven others (Google)** · the Transformer

**Front.** In 2017 eight researchers at Google were trying to make machine translation faster. The models of the day read a sentence one word at a time, each step waiting on the one before it, which made them slow to train and hard to grow. The eight wrote a [nine-page paper](https://arxiv.org/abs/1706.03762) describing a design that threw out the waiting: it read every word of a sentence at once and learned which words to pay attention to. It [trained in 3.5 days on eight GPUs](https://arxiv.org/abs/1706.03762) where older models took far longer. What was new was the shape. It had no built-in ceiling, so it [kept getting better the bigger you made it and the more text and compute you fed it](https://arxiv.org/abs/2001.08361).

**Back.** That shape, the Transformer, opened the way to a new kind of model: train it on a mountain of text, then ask it anything. Google published the paper and patented nothing, so anyone could build on it. Within a year OpenAI built [its first GPT](https://en.wikipedia.org/wiki/GPT-1) on the same design. The model traveled free with the idea, fast as a download, and held no ground of its own. The lead pooled downstream, in the chips and giant clusters needed to train and run it at scale, while the [chatbot built on it reached 100 million users in two months](https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/). The design is free for all; the cluster that runs it is the moat.

*Curator's note:* **Placement.** Model cell, Mountain View, 2017, the Google row, on [[Thread - Machine Learning]]. Serves Goal Both: it is the foundation of an entire industry and still confers no proprietary lead, because a published architecture is non-rival and travels as fast as the idea. Mechanism tagged Fragility: a free, published abstraction with no moat, where the value drains downstream into the compute and scale that run it. Confidence: Direct on the front facts (the 2017 paper, eight authors, parallel reading via self-attention, 3.5 days on eight GPUs, the scaling-law power curve); the "value pooled in compute" read is the card's thesis, plausible-to-direct. Caveats: the ChatGPT user figure is a single analyst estimate, and the nine-page count is the arXiv body before references (the proceedings version runs longer) — both flagged below.

**Analysis.** This is the deck's second no-moat Model and the live, present-day case where the others are history. It adds the AI chapter to the Model argument: where [[Tooling Card - The Bit]] is the 1948 abstraction that conferred prestige but no moat, the Transformer is the 2017 one that did the same, only faster and louder. The two form a committed two-way pair: both are free, published abstractions whose lead pooled downstream — for the bit, in the instruments and chips that race against Shannon's limit; for the Transformer, in the clusters that train and serve the model. Run them as a parade beat together, the field-defining model that the field's own authors gave away. The cross-links that mesh it in: the non-moat rhyme with [[Tooling Card - The Bit]]; the value that pooled in the GPU and CUDA cards and in the chips behind them on [[Thread - Chip Lithography]]. Hero, because it carries the whole modern-AI Model argument on its own.

**Nuance + sources.** Front facts from the arXiv paper ([1706.03762](https://arxiv.org/abs/1706.03762)): eight authors, all listed as equal contributors with randomized order (so no single lead), 3.5 days on eight GPUs, 28.4 BLEU English-German and 41.8 BLEU English-French. The "keeps getting better with scale" claim rests on Kaplan et al. 2020 ([2001.08361](https://arxiv.org/abs/2001.08361)), which trained 200+ models across seven orders of magnitude of compute and found loss falls as a power law in model size, data, and compute. GPT-1 lineage from [Wikipedia/GPT-1](https://en.wikipedia.org/wiki/GPT-1) (OpenAI, June 2018, decoder-only Transformer). The 100-million-users-in-two-months figure is a UBS/Similarweb analyst estimate reported by [Reuters](https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/), never confirmed by OpenAI — widely repeated, not audited; treat as illustrative. The nine-page count describes the arXiv v1 body; the NeurIPS proceedings version is longer (pp. 5998–6008). Affiliations (Google Brain / Google Research) are standard and documented but not printed on the arXiv abstract page.
