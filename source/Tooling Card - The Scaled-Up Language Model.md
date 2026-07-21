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
Significance: "Growing a Transformer to internet scale, then tuning it to follow plain instructions, made one model that does many tasks. Because the recipe was published, the durable lead settled not in the model but in the chips and fabs that train and run it."
BuildsOn:
  - "[[Tooling Card - CUDA]]"
  - "[[Tooling Card - TCP-IP]]"
  - "[[Tooling Card - The Deep-Learning Framework]]"
  - "[[Tooling Card - The Transformer]]"
  - "[[Tooling Card - The Through-Silicon Via]]"
Enables:
Threads:
  - "[[Thread - Machine Learning]]"
---
*Make · San Francisco, California, USA · 2020-2022*
**OpenAI** · a Transformer grown to 175 billion parts, then tuned to follow instructions

**Front.** In 2020, OpenAI had a kind of model called a Transformer that learned to guess the next word in a sentence. The question was simple and unanswered: if they made it much bigger, did it keep getting better, or did it stop. So they built one model with [175 billion adjustable parts](https://arxiv.org/abs/2005.14165), stacked in 96 layers, and let it read about 300 billion words from the open internet, a run measured not in days but in raw computing, [about 3,640 petaflop/s-days](https://moocaholic.medium.com/gpt-3-language-models-are-few-shot-learners-a13d1ae8b1f9), spread across a big cluster of chips. No clever idea drove it. Scale alone gave the model a trick no one trained in: show it [a couple of examples in the prompt](https://arxiv.org/abs/2005.14165) and it would do a fresh task it had never been tuned for.

**Back.** The raw model was powerful but hard to steer, so in 2022 OpenAI added a second step: they had people rank its answers and [trained the model on those rankings](https://arxiv.org/abs/2203.02155) until it followed plain requests. The fix worked so well that a tuned model 100 times smaller was [preferred over the giant one](https://openai.com/index/instruction-following/). Everyone copied the recipe, because the recipe is published; the part no one can copy is the silicon. The race for AI ended at the same narrow gate as the race for chips: the GPUs from NVIDIA and the fabs behind them. China shows it cleanest. It has the models and the talent, but export controls cut it off from top GPUs and it cannot yet make the advanced chips, so its labs run on borrowed silicon.

