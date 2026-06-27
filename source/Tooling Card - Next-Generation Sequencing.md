---
Tags: tooling-card
Name: Next-Generation Sequencing
Kind: Measure
Tool: Massively parallel sequencing-by-synthesis on a flow cell
Person: Shankar Balasubramanian and David Klenerman (Solexa)
Place: Cambridge, England
City: Cambridge
Lat: 52.2053
Lon: 0.1218
Era: 2000s
Year: 2006
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: read a whole human genome for the price of a phone
Significance: "It made reading DNA cheap enough to do at scale, dropping the cost of a human genome from billions to hundreds of dollars."
BuildsOn:
  - "[[Tooling Card - PCR]]"
  - "[[Tooling Card - The Laser]]"
  - "[[Tooling Card - DNA Sequencing]]"
Enables:
  - "[[Tooling Card - DNA-Encoded Libraries]]"
Threads:
  - "[[Thread - Reading & Writing DNA]]"
---
*Measure · Cambridge, England · 2000s*
**Shankar Balasubramanian and David Klenerman** · read millions of DNA strands at once on a glass chip

**Front.** In the summer of 1997 two Cambridge chemists, Shankar Balasubramanian and David Klenerman, were watching a motor protein crawl along a single strand of DNA and got to talking, partly [over beer at a local pub](https://www.enterprise.cam.ac.uk/10th-anniversary-story-solexa/). The old way of reading DNA, [Sanger's method](https://en.wikipedia.org/wiki/Sanger_sequencing), read one stretch at a time and was far too slow and costly to read a whole human genome cheaply. Their idea, sold as the [Genome Analyzer in 2006](https://www.illumina.com/science/technology/next-generation-sequencing/illumina-sequencing-history.html), spreads millions of short DNA fragments across a coated glass slide called a flow cell, then reads them all at the same time: it flows in the four DNA letters one base at a time, each carrying a different colored tag, and a camera photographs which color lights up at every spot. What was new was the count, not the chemistry. Instead of reading a few strands, the machine read [millions in parallel](https://en.wikipedia.org/wiki/Illumina_dye_sequencing), so the cost fell with every new generation of the chip.

**Back.** [Illumina bought the company, Solexa, in 2007](https://www.enterprise.cam.ac.uk/case-studies/solexa-second-generation-genetic-sequencing/) and pushed the flow cell hard: the genome that cost the [Human Genome Project about $2.7 billion](https://www.genome.gov/about-genomics/fact-sheets/Sequencing-Human-Genome-cost) dropped to [roughly $1,000 by 2014](https://en.wikipedia.org/wiki/$1,000_genome) and a [couple hundred dollars](https://frontlinegenomics.com/the-100-genome-wheres-the-limit/) by the 2020s. For years Illumina (US) had a near lock on the machines, the way one firm can own a whole field by owning the one tool everyone needs. Then China's BGI bought California's [Complete Genomics in 2013 for $118 million](https://en.wikipedia.org/wiki/Complete_Genomics) and used it to build its own sequencers under [MGI](https://en.wikipedia.org/wiki/MGI_(company)), which now sell for [around 30% less](https://www.genomeweb.com/sequencing/complete-genomics-unveils-new-platform-ultra-high-throughput-sequencing-market) and won BGI a [$333.8 million patent verdict](https://www.nature.com/articles/d41586-022-01505-5) against Illumina in 2022. The sequencer is now a clean US-versus-China tooling fight, the DRAM-and-stepper story told again in biology.

*Curator's note:* (1) Placement: Measure, Goal Both, mechanism Convergence, confidence Direct. The flow cell is the seeing tool that the read/write/edit thread all rest on. (2) Analysis: pairs against Sanger DNA Sequencing as the cheap-at-scale successor that it replaced for big projects, and it is the measurement floor every later writing and editing tool stands on. The US-China split makes it a good Convergence-then-contest case next to lithography. (3) Nuance: the founding idea was 1997 and the company 1998, but the dated landing moment is the 2006 Genome Analyzer, the first machine that shipped the method. The $100 figure was an Ultima Genomics claim, not yet routine; I kept the conservative "couple hundred dollars" line tied to Illumina and BGI shipping prices.
