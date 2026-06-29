---
Tags: tooling-card
Name: The Social Graph
Kind: Make
Tool: people as nodes, ties as edges
Person: Mark Zuckerberg
Place: Cambridge, Massachusetts, USA
City: Cambridge
Lat: 42.37
Lon: -71.10
Era: 2000s
Year: 2004
Goal: Both
Mechanism: Fragility
Confidence: Direct
Unlocked: a queryable map of who knows whom, held by one company
Significance: "It made the network of human ties a thing one company could store, query, and own, and that ownership became the moat."
BuildsOn:
  - "[[Tooling Card - Graph Theory]]"
  - "[[Tooling Card - The Web]]"
Threads:
  - "[[Thread - The Network]]"
---
*Make · Cambridge, Massachusetts, USA · 2000s*
**Mark Zuckerberg** · people as nodes, ties as edges

**Front.** On [4 February 2004](https://en.wikipedia.org/wiki/History_of_Facebook) Mark Zuckerberg, a 19-year-old sophomore, launched a site called TheFacebook from his dorm in [Kirkland House](https://www.cnbc.com/2017/05/25/mark-zuckerberg-returns-to-the-harvard-dorm-where-facebook-was-born.html) at Harvard. The shape was not new: [SixDegrees](https://en.wikipedia.org/wiki/SixDegrees.com) had stored people and their friend lists back in 1997 and peaked near 3.5 million users before folding, and Friendster did the same in 2002. What Zuckerberg did was build that shape into a real, fast database that any feature could read: every person was a node, every friendship an edge, and the whole map could be asked questions at speed. Within the first month more than half of Harvard's undergraduates had signed up.

**Back.** At its [f8 conference](https://about.fb.com/news/2007/05/facebook-unveils-platform-for-developers-of-social-applications/) on 24 May 2007 Facebook handed the map to outside developers and named it the "social graph." The term stuck. The database idea was never secret. By 2013 Facebook had published [TAO](https://engineering.fb.com/2013/06/25/core-infra/tao-the-power-of-the-graph/), the store that answered who-knows-whom across billions of edges, and let outsiders read how it worked. The moat was the graph itself: real users and real ties. A rival cannot copy it without first copying the people, which is why SixDegrees and Friendster died with their small graphs and Facebook, still holding the largest one on Earth, did not.

