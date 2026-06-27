---
Tags: tooling-card
Name: PageRank
Kind: Model
Tool: rank pages by the links pointing at them
Person: Larry Page and Sergey Brin
Place: Stanford, California, USA
City: Stanford
Lat: 37.43
Lon: -122.17
Era: 1990s
Year: 1998
Goal: Both
Mechanism: Fragility
Confidence: Direct
Unlocked: search that ranks by who links to you, not how often a word repeats
Significance: "Treating the whole web as one graph turned the link itself into a vote, and the page everyone linked to rose to the top."
BuildsOn:
  - "[[Tooling Card - Graph Theory]]"
  - "[[Tooling Card - The Web]]"
Threads:
  - "[[Thread - The Network]]"
---

*Model · Stanford, California, USA · 1990s*
**Larry Page and Sergey Brin** · rank pages by who links to them

**Front.** By the late 1990s the web was huge and search was poor. Most engines ranked a page by how often your words appeared on it, which anyone could rig by stuffing a page with the same word. Two Stanford graduate students, [Larry Page and Sergey Brin](https://en.wikipedia.org/wiki/PageRank), tried the reverse. Treat the whole web as one giant graph and imagine a reader who clicks links at random, on and on. The pages that reader lands on most are the important ones, because important pages tend to be linked by other important pages. The math underneath is the [dominant eigenvector of the link matrix](http://infolab.stanford.edu/~backrub/google.html). A link had become a vote.

**Back.** It made search good, and it made Google. The method was openly [published in 1998](http://infolab.stanford.edu/~backrub/google.html) and the patent belonged to Stanford, so the algorithm itself was never the secret. Google's lead pooled somewhere else: in crawling and indexing the entire web, and in the machines to do it fast. Stanford later sold its share of the patent for [about $336 million](https://en.wikipedia.org/wiki/PageRank). The lead lived in the data and the infrastructure, never in the equation.

