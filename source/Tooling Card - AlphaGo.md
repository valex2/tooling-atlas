---
Tags: tooling-card
Name: AlphaGo
Kind: Model
Tool: deep reinforcement-learning player
Person: DeepMind (David Silver, Demis Hassabis)
Place: London, UK
City: London
Lat: 51.51
Lon: -0.13
Era: 2010s
Year: 2016
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: machines that learn a hard game by playing themselves
Significance: "A London lab taught a program to teach itself the game of Go and beat the best human, proving self-play could reach past where hand-written rules stopped."
BuildsOn:
  - "[[Tooling Card - Backpropagation]]"
  - "[[Tooling Card - cuda-convnet]]"
Enables:
  - "[[Tooling Card - AlphaFold]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Model · London, UK · 2010s*
**DeepMind (David Silver, Demis Hassabis)** · a program that learns Go by self-play

**Front.** In October 2015, a small team at [DeepMind](https://www.nature.com/articles/nature16961) in London sat the European Go champion Fan Hui down against a program they called AlphaGo. Go has more possible board positions than atoms in the visible universe, so no computer could just count out the moves the way one counts out chess. The team's answer was to grow two [neural networks](https://deepmind.google/research/breakthroughs/alphago/): one that looked at a board and guessed a good move, and one that looked at a board and guessed who was winning, both fed first by [160,000 human games](https://www.nature.com/articles/nature16961) and then sharpened by having the program play copies of itself millions of times. Bolt those two guesses onto a search that reads only the lines worth reading, and the machine had a feel for the game instead of a brute count. AlphaGo [won 5-0](https://www.britgo.org/deepmind2016/summary), the first time software had beaten a Go professional on a full board with no handicap.

**Back.** Five months later, in March 2016, AlphaGo faced Lee Sedol, one of the best players alive, in Seoul before an [audience of 200 million](https://blog.google/innovation-and-ai/products/alphagos-ultimate-challenge/), and won [4-1](https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol). Most experts had thought a Go win was [ten years off](https://deepmind.google/research/breakthroughs/alphago/). Within a year the same London group cut the human games out entirely and built [AlphaGo Zero](https://www.nature.com/articles/nature24270), which learned only from playing itself and grew stronger still, and then bent the self-play trick toward folding proteins in [AlphaFold](https://www.nature.com/articles/s41586-021-03819-2). The method spread fast because the paper laid out how it worked, so the lead did not sit in the winning program but in the labs with the machines and the people to run the loop again.

