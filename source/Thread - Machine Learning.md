---
Tags: tooling-thread
Name: Machine Learning
---
The youngest thread, and the place where the others meet. Modern AI is not one invention but a collision: a learning method (backpropagation, 1986) that sat nearly useless for a generation, the parallel compute to run it (the GPU, made general-purpose by CUDA in 2006), and the labeled data to train it (ImageNet, 2009) all matured apart and crashed together in 2012 with AlexNet. The Transformer (2017) then handed the field an architecture with no ceiling, and scaling it produced the large language models behind ChatGPT.

The thread's lesson is the deck's oldest law. The models are free abstractions that travel as fast as any published idea, so the Transformer, like [[Tooling Card - The Bit]], refuses to be a moat, and leadership does not pool in the math. It pools downstream in the compute, which means this thread sits on [[Thread - Electronic Switching]] (the GPU is the chip after the microprocessor) and ultimately on [[Thread - Chip Lithography]], the EUV lithography that makes the most advanced chips. AI power is chip power, and chip power is lithography power. That is also why China, with the models and the talent, sits at the *absent* end of the dominance spectrum next to China's Solar Chain (total) and China's Machine Tools (partial): export-controlled out of the top GPUs and unable to make advanced chips. The whole stack runs on the software of [[Thread - Portable Software]].

Cards on this thread, oldest first:

```dataviewjs
const cards = dv.pages("#tooling-card")
  .where(p => (p.Threads ?? []).some(t => t.path === dv.current().file.path))
  .sort(p => p.Year, "asc");
if (!cards.length) { dv.paragraph("_No cards on this thread yet._"); }
else {
  dv.table(["Card", "Year", "Place", "Kind", "Unlocked"],
    cards.map(p => [p.file.link, p.Year, p.Place, p.Kind, p.Unlocked]));
}
```
