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
Significance: "Cutting a message into small numbered packets, each finding its own route, is the idea every computer network runs on. Published openly, it left the lead to pool in the gear and protocols built on top."
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

**Back.** Because the routes are not fixed, a packet network bends around a dead link instead of dropping the call, and a shared line carries many conversations at once. Davies' team presented the scheme at a [1967 symposium](https://en.wikipedia.org/wiki/Packet_switching), where the ARPANET designers picked up both his design and his word, and Davies built the first working packet network at NPL by [1969](https://en.wikipedia.org/wiki/Donald_Davies). Baran and Davies published rather than patented, so no one could fence the idea. Every computer network since runs on it, yet the money went to the firms that built the routers and wrote the protocols (TCP/IP, Cisco) that turn loose packets into a working internet.

