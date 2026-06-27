---
Tags: tooling-card
Name: The Scaled-Up Language Model
Kind: Make
Tool: a Transformer grown to 175 billion parts, then tuned to follow instructions
Person: OpenAI
Place: San Francisco, California, USA
Lat: 37.77
Lon: -122.42
City: San Francisco
Era: 2020-2022
Year: 2020
Goal: Both
Mechanism: Fragility
Confidence: Direct
Unlocked: one model that does many tasks, and an AI race that resolves to who makes the chips
Significance: "Growing a Transformer to internet scale and then tuning it to follow plain instructions made a single model that does many tasks, but its published recipe meant the durable lead settled not in the model but in the chips and fabs that train and run it."
BuildsOn:
  - "[[Tooling Card - The GPU]]"
  - "[[Tooling Card - TCP-IP]]"
  - "[[Tooling Card - The Deep-Learning Framework]]"
  - "[[Tooling Card - The Transformer]]"
Enables:
Threads:
  - "[[Thread - Machine Learning]]"
---
*Make · San Francisco, California, USA · 2020-2022*
**OpenAI** · a Transformer grown to 175 billion parts, then tuned to follow instructions

**Front.** In 2020, OpenAI had a kind of model called a Transformer that learned to guess the next word in a sentence. The question was simple and unanswered: if they made it much bigger, did it keep getting better, or did it stop. So they built one model with [175 billion adjustable parts](https://arxiv.org/abs/2005.14165), stacked in 96 layers, and let it read about 300 billion words from the open internet, a run measured not in days but in raw computing, [about 3,640 petaflop/s-days](https://moocaholic.medium.com/gpt-3-language-models-are-few-shot-learners-a13d1ae8b1f9), spread across a big cluster of chips. The new thing was not a clever idea. It was that scale alone gave the model a trick no one trained in: show it [a couple of examples in the prompt](https://arxiv.org/abs/2005.14165) and it would do a fresh task it had never been tuned for.

**Back.** The raw model was powerful but hard to steer, so in 2022 OpenAI added a second step: they had people rank its answers and [trained the model on those rankings](https://arxiv.org/abs/2203.02155) until it followed plain requests. The fix worked so well that a tuned model 100 times smaller was [preferred over the giant one](https://openai.com/index/instruction-following/). Everyone copied the recipe, because the recipe is published; the part no one can copy is the silicon. So the lead did not pool in the model. It pooled in the machines that train and run it, the GPUs from NVIDIA and the fabs behind them, and the race for AI ended at the same narrow gate as the race for chips.

*Curator's note:* **Placement.** Cell: Make / scaling endpoint. Goal: Both (the tool that proves demand and the endpoint that shows where the lead settles). Mechanism: Fragility, because the model is the *opposite* of a moat. The architecture is public, the scaling recipe (grow a Transformer, then instruction-tune it) is public, the leaders' weights are guarded but reproducible, so the durable advantage lives one and two layers down in compute and fabs. Confidence: Direct on all load-bearing facts.

**Analysis.** This is the endpoint of the Machine Learning thread, reframed off the chat *product* and onto the *tool*: the scaled, trained artifact plus its recipe. Two beats in one card. GPT-3 (2020) shows scale itself buys generality; InstructGPT (2022) shows a cheap tuning step makes that generality follow orders. The parade lands not on a user count but on the reveal that the AI race and the chip race share one chokepoint. The card hands the reader *back down* the stack to the supply-side hardware cards: the lead pooled in the GPU/CUDA card, and in the fabs that make the silicon, [[Tooling Card - The EUV Machine]] (EUV) and [[Tooling Card - The High-Yield Process Recipe]]. The China seam is the sharpest mesh: China has the models and the talent but is export-controlled out of top GPUs and cannot make advanced chips, so on the dominance spectrum it sits at the "absent" end, next to China's Solar Chain (total dominance). It also rests on the software stack of [[Tooling Card - Unix and C]] (CUDA). Thread: Machine Learning. Pairs as the demand-side bookend to the supply-side hardware cards; cleanest example of a tool that is a non-moat.

**Nuance + sources.** *Model/Make straddle:* a scaled language model sits between kinds. The trained network is an abstraction that represents and reasons, which reads as Model; but the load-bearing tool here is the *built, trained artifact* and the *manufacturing-style recipe* (gather words, gather chips, run the training, then tune), so Make is defensible and is the choice. Filed Make because the whole thesis is that the lead lives in the *making*, the compute and fabs, not in the abstraction, which is free. The earlier version of this card led on ChatGPT, the consumer launch (Nov 30, 2022) and its ~100M-users-in-two-months figure (a UBS estimate on Similarweb data, an outside number); reframed onto the tool, those facts are now context, not the card. GPT-3's 175B parameters, 96 layers, ~300B training tokens, and few-shot behavior are from the primary paper "Language Models are Few-Shot Learners," arXiv:2005.14165 (May 2020). The ~3,640 petaflop/s-day training-compute figure is a secondary estimate derived from that paper's reported FLOPs (flagged as an estimate, not an OpenAI-reported number). The instruction-tuning step and the "1.3B preferred over 175B" result are from "Training Language Models to Follow Instructions with Human Feedback," arXiv:2203.02155 (Ouyang et al., March 2022) and OpenAI's own write-up. Avoided breathless framing per the brief.
