---
Tags: tooling-card
Name: Generative Drug Design
Kind: Model
Tool: Generative model that designs candidate molecules
Person: Alex Zhavoronkov, Insilico Medicine
Place: Hong Kong
City: Hong Kong
Lat: 22.32
Lon: 114.17
Era: 2010s
Year: 2019
Goal: Both
Mechanism: Convergence
Confidence: Plausible
Unlocked: software that draws new drug molecules to order
Significance: "A model that invents new molecules to fit a target turns drug discovery from a search into a design problem."
BuildsOn:
  - "[[Tooling Card - The Deep-Learning Framework]]"
Enables: []
Threads:
  - "[[Thread - Therapeutics]]"
  - "[[Thread - Machine Learning]]"
---
*Model · Hong Kong · 2010s*
**Alex Zhavoronkov, Insilico Medicine** · a model that draws new molecules

**Front.** In 2019 a team at Insilico Medicine wanted a drug to block DDR1, a protein tied to scarred lung tissue. Picking a molecule the old way meant testing huge libraries of chemicals one by one, hoping one stuck. Instead they ran a model called [GENTRL](https://www.nature.com/articles/s41587-019-0224-x): trained on known chemistry, it drew brand-new molecules to order and scored how tightly each should grip the target, narrowing millions of options to a handful worth making. In [21 days](https://www.eurekalert.org/news-releases/806724) the model designed six molecules; four worked in the test tube and one held up in mice. The new part was that the software did not pick a molecule off a shelf, it invented one.

**Back.** GENTRL was a landmark, not the beginning: AI had been turned on drug hunting since [Atomwise and Exscientia in 2012](https://www.biopharmatrend.com/business-intelligence/ai-drug-discovery-pipelines/), and the generative trick traces to [GANs in 2014](https://en.wikipedia.org/wiki/Generative_adversarial_network); what was new in 2019 was a generated molecule that actually held up in an animal. The idea spread fast once a model could both fold a protein and design a binder for it. [Isomorphic Labs](https://www.cnbc.com/2025/04/09/inside-isomorphic-labs-google-deepminds-ai-life-sciences-spinoff.html), spun out of Google DeepMind in 2021, built its design engine on [[Tooling Card - AlphaFold]] and [raised $2.1 billion](https://www.rdworldonline.com/alphabet-spinoff-isomorphic-labs-raises-2-1-billion-in-quest-to-solve-all-disease-with-ai-based-drug-discovery-tools/) in 2026 to run it, with drug deals at Novartis and Eli Lilly. The field split along familiar lines: in the US, Recursion and the UK's Exscientia [merged in 2024](https://www.biopharmadive.com/news/recursion-exscientia-merger-deal-artificial-intelligence-drug-discovery/723714/) into one Salt Lake City firm, while Insilico, founded with Hong Kong roots, took its AI-designed lung drug Rentosertib through a [Phase 2 trial in China](https://www.insideprecisionmedicine.com/news-and-features/insilico-medicine-brings-first-ai-designed-drug-to-clinical-trials/) and listed in Hong Kong in 2025.

*Curator's note:* (1) Placement: Model kind, Goal Both, Convergence mechanism, Confidence Plausible. The tool is the generative model that designs molecules, not the molecules or the firms. (2) Analysis: this is the design-side companion to AlphaFold: AlphaFold tells you the shape of the lock, the generative model draws a key for it. Sits with the deep-learning framework cards as a downstream application of the same training machinery. Contrast with model cards whose moat is non-rival: here the trained weights and the proprietary chemistry data are the closely held asset, so leadership pools in firms, not in a published abstraction. (3) Nuance: prediction is well ahead of proof. Rentosertib reached Phase 2 but no fully AI-designed drug has yet cleared late-stage trials and reached patients, so the claim is that the tool reshapes early discovery, not that it has delivered an approved medicine. The 21-day figure covers design only; with synthesis and animal testing the cited run took 46 days. The card centers Insilico's 2019 GENTRL as the dated landmark; the AlphaFold-derived Isomorphic Labs (2021) is the prominent later entrant and sits in the back. AI drug discovery as a field is older (Atomwise and Exscientia, 2012), so this is the generative-design landmark, not a claim that anyone invented the field.
