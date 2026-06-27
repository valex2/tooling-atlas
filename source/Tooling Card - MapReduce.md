---
Tags: tooling-card
Name: MapReduce
Kind: Model
Tool: write two functions, run them on a thousand machines
Person: Jeff Dean and Sanjay Ghemawat
Place: Mountain View, California, USA
Lat: 37.39
Lon: -122.08
City: Mountain View
Era: 2000s
Year: 2004
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: process web-scale data on cheap machines
Significance: "MapReduce let a programmer write two short functions and have the system spread them across thousands of cheap machines, handling the failures and the splitting, so web-scale data became something an ordinary engineer could process."
BuildsOn:
  - "[[Tooling Card - The Microprocessor]]"
Threads:
  - "[[Thread - The Network]]"
---
*Model · Mountain View, USA · 2000s*
**Jeff Dean and Sanjay Ghemawat** · two functions, a thousand machines

**Front.** By the early 2000s, indexing the whole web meant chewing through more data than any single computer could hold, so the work had to spread across thousands of cheap machines at once. Doing that by hand was a nightmare: machines fail constantly at that scale, and someone had to split the data, hand out the work, and stitch the answers back together. At Google, [Jeff Dean and Sanjay Ghemawat](https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/) noticed that almost all of these jobs had the same shape, and in [2004 they wrote it down as a model](https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/) with two parts: a *map* step that does one small thing to every piece of data, and a *reduce* step that combines the results. The new thing was that you only wrote those two short functions, and the system did the rest, [splitting the data, scheduling the work, and quietly working around machines that died mid-job](https://en.wikipedia.org/wiki/MapReduce).

**Back.** It turned a thousand unreliable computers into one dependable one, and made processing enormous datasets routine instead of heroic. Yahoo built a free copy called [Hadoop](https://en.wikipedia.org/wiki/Apache_Hadoop), and for a decade it was how the world did "big data," the plumbing under search, advertising, and later the giant text and image piles that machine learning is trained on. Like any published model it gave Google a head start and no lasting moat; the paper told everyone how, and the idea spread.

