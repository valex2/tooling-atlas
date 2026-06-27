---
Tags: tooling-card
Name: Packet Switching
Kind: Model
Tool: chop a message into routed packets
Person: Donald Davies (with Paul Baran)
Place: Teddington, United Kingdom
City: Teddington
Lat: 51.43
Lon: -0.33
Era: 1960s
Year: 1965
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: a network that survives broken links
Significance: "Cutting a message into small numbered packets that each find their own route is the switching idea every computer network runs on, and because it was published openly the lead pooled in the gear and protocols built on top of it."
BuildsOn:
  - "[[Tooling Card - The Bit]]"
Enables:
  - "[[Tooling Card - The Router]]"
  - "[[Tooling Card - TCP-IP]]"
Threads:
  - "[[Thread - The Network]]"
---
*Model · Teddington, United Kingdom · 1960s*
**Donald Davies (with Paul Baran)** · chop a message into routed packets

**Front.** In 1965 [Donald Davies](https://www.internethalloffame.org/inductee/donald-davies/), a physicist at Britain's [National Physical Laboratory](https://en.wikipedia.org/wiki/Donald_Davies) in Teddington, was looking at how computers might talk to each other. A phone call holds one wire open end to end for the whole call, but computer traffic comes in bursts with long gaps, so a held-open line sits idle most of the time. Davies' answer was to cut each message into small blocks of [about 1,024 bits](https://en.wikipedia.org/wiki/Packet_switching), number them, and let each block hop node to node and find its own way across a shared network, then reassemble in order at the far end. He called the block a [packet](https://www.internethalloffame.org/inductee/donald-davies/), a plain word he picked so it would translate cleanly. At RAND in California, [Paul Baran had reached the same idea independently](https://en.wikipedia.org/wiki/Packet_switching) a few years earlier while designing a network that could keep running after a [nuclear strike](https://www.rand.org/pubs/research_memoranda/RM3420.html) took out part of it.

**Back.** Because the routes are not fixed, a packet network bends around a dead link instead of dropping the call, and a shared line carries many conversations at once. Davies' team presented the scheme at a [1967 symposium](https://en.wikipedia.org/wiki/Packet_switching), where the ARPANET designers picked up both his design and his word, and Davies built the first working packet network at NPL by [1969](https://en.wikipedia.org/wiki/Donald_Davies). Baran and Davies published rather than patented, so no one could fence the idea. It opened the way to every computer network that followed, and the lasting lead slid downstream to the protocols and routers built to run it.

*Curator's note:* **Placement.** Model cell, Teddington, 1965, on [[Thread - The Network]]. Goal 1 in the inverted, no-moat form the deck reserves for Models: a switching scheme published openly becomes the floor of an industry while conferring no proprietary lead. Mechanism Convergence: bursty-traffic statistics, numbered blocks, store-and-forward routing, and reassembly converge into one switching idea. Confidence Direct on the front facts (1965 Davies, ~1024-bit blocks, "packet" coinage, independent Baran). **Analysis.** Sits directly on [[Tooling Card - The Bit]]: Shannon's math says how much a channel can carry, packet switching says how to slice and route what flows across it, both published-and-unfenceable, so the pair makes the cleanest two-card statement of the deck's no-moat Model argument. Enables [[Tooling Card - TCP-IP]], which is the rulebook that made independently routed packets reliable end to end and turned the idea into the internet. Pairs against the Make/Manufacture moat cards as another case where the abstraction traveled freely and the money pooled in the hardware. **Nuance.** Genuine independent co-invention: Baran at RAND (early 1960s, the eleven-volume *On Distributed Communications*, 1964) and Davies at NPL (1965). Davies coined "packet" and "packet switching" in 1965-66 and learned of Baran's prior work only afterward; both chose a ~1024-bit block, a real coincidence noted in the histories. I placed the card at Teddington because Davies named the thing and built the first operational network, but the front and frontmatter credit Baran. The card stays off the deeper ARPANET/Roberts adoption history, which belongs in the essay.
