---
Tags: tooling-card
Name: LSTM
Kind: Model
Tool: gated recurrent memory cell
Person: Sepp Hochreiter & Jürgen Schmidhuber
Place: Munich, Germany
City: Munich
Lat: 48.14
Lon: 11.58
Era: 1990s
Year: 1997
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: networks that remember across long sequences
Significance: "The gated memory cell let a network carry a signal across a thousand steps, and for a decade Google's speech and translation systems ran on it before the Transformer took its place."
Enables:
  - "[[Tooling Card - ResNet]]"
  - "[[Tooling Card - The Transformer]]"
BuildsOn:
  - "[[Tooling Card - Backpropagation]]"
Threads:
  - "[[Thread - Machine Learning]]"
---
*Model · Munich, Germany · 1990s*
**Sepp Hochreiter & Jürgen Schmidhuber** · a memory cell with gates

**Front.** In [1991](https://en.wikipedia.org/wiki/Sepp_Hochreiter), a computer-science student in Munich named Sepp Hochreiter wrote a diploma thesis, in German, on a nagging failure: networks trained to read sequences forgot what they had seen, because the training signal shrank at every step it was passed back, until nothing was left to learn from. With his advisor [Jürgen Schmidhuber](https://people.idsia.ch/~juergen/) he coded a fix, a small memory cell built around a loop that feeds its own value back to itself unchanged, so the signal can ride the loop as long as needed without fading. Around the loop they wired little learned gates that open and shut, deciding what may enter the cell and what may be read out of it. Their [1997 paper](https://direct.mit.edu/neco/article/9/8/1735/6109/Long-Short-Term-Memory) showed the cell holding a clue across more than [1,000 steps](https://deeplearning.cs.cmu.edu/S23/document/readings/LSTM.pdf) of a sequence, where every earlier network had lost the thread.

**Back.** For nearly twenty years the cell stayed a research curiosity, waiting for chips and data big enough to feed it. Then it went everywhere at once: in [2015](https://research.googleblog.com/2015/08/the-neural-networks-behind-google-voice.html) Google rebuilt its voicemail transcription around LSTM and cut errors by [49 percent](https://techcrunch.com/2015/07/23/google-promises-improved-voicemail-transcriptions-cuts-error-rate-by-49/), and in [2016](https://arxiv.org/abs/1609.08144) it stacked the cells eight layers deep inside Google Translate, trimming translation errors by about 60 percent. The recipe had been public since 1997, so the gains pooled where the data and the chips sat, at Google in California; in [2017](https://arxiv.org/abs/1706.03762) Google's own researchers published the Transformer, which dropped the memory cell altogether, and Hochreiter, by then a professor in Linz, was still answering in [2024](https://arxiv.org/abs/2405.04517) with a new LSTM built to fight its way back.

