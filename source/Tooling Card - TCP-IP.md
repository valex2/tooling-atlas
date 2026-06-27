---
Tags: tooling-card
Name: TCP/IP
Kind: Model
Tool: a shared protocol joining separate networks
Person: Vint Cerf and Bob Kahn
Place: Stanford, California, USA
Lat: 37.43
Lon: -122.17
City: Stanford
Era: 1970s
Year: 1974
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: many separate networks joined into one internet
Significance: "TCP/IP let separately built networks hand packets to one another through gateways, turning many private networks into one internet that no one owned."
BuildsOn:
  - "[[Tooling Card - The Bit]]"
  - "[[Tooling Card - Packet Switching]]"
  - "[[Tooling Card - The Router]]"
  - "[[Tooling Card - Ethernet]]"
Enables:
  - "[[Tooling Card - The Web]]"
  - "[[Tooling Card - The Scaled-Up Language Model]]"
Threads:
  - "[[Thread - The Network]]"
  - "[[Thread - Long-Distance Comms]]"
---
*Model · Stanford, USA · 1970s*
**Vint Cerf and Bob Kahn** · one language for many networks

**Front.** The deep idea came first: instead of holding open a wire for a whole call, chop a message into small blocks and let each [packet](https://www.britannica.com/biography/Paul-Baran) find its own way across the network, an idea worked out around 1965 by [Paul Baran at RAND and Donald Davies in Britain](https://en.wikipedia.org/wiki/Paul_Baran). By the early 1970s there were several such packet networks, but each spoke its own language and none could talk to the others. In a [1974 paper](https://ethw.org/Milestones:Transmission_Control_Protocol_(TCP)_Enables_the_Internet,_1974), [Vint Cerf and Bob Kahn](https://www.invent.org/inductees/vinton-g-cerf) set out one shared set of rules any network could follow, plus a box at each border, a [gateway, which we now call a router](https://www.scienceandmediamuseum.org.uk/objects-and-stories/short-history-internet), to pass packets between them. The new thing was a way to join networks that were built by different people, in different ways, into one.

**Back.** They called it internetworking, and the joined-up whole became the internet. The rules were [split in 1978 into two layers](https://ethw.org/Milestones:Transmission_Control_Protocol_(TCP)_Enables_the_Internet,_1974), TCP to make sure nothing was lost and IP to carry and address each packet, which is the TCP/IP name that stuck, and on [1 January 1983 the ARPANET switched over to it](https://en.wikipedia.org/wiki/Paul_Baran) for good. Because the protocol was open and free for anyone to use, no company owned the network it created, and the value piled up at the edges instead, in the services and, decades on, in the [ocean of text used to train large language models](https://en.wikipedia.org/wiki/GPT-3). The standard was the whole point: a thing made to be copied, so the lead never sat in the protocol itself.

*Curator's note:* **Placement.** Model cell, the internetworking protocol, 1974, head of the new [[Thread - The Network]] and a digital continuation of [[Thread - Long-Distance Comms]]. Goal Both; Mechanism Convergence. Confidence Direct. **Analysis.** This fills the deck's whole digital-network hole: it had analog comms (Telstar, the cable, long-distance telephony) but nothing of the internet. TCP/IP is a standard, like [[Tooling Card - The Go-No-Go Gauge]], a tool whose job is to be adopted by everyone, so it confers leadership broadly and holds it nowhere. It BuildsOn [[Tooling Card - The Bit]] (packets are digital information) and points forward to [[Tooling Card - The Scaled-Up Language Model]], because the corpus those models learn from is the internet this protocol made. **Nuance.** Packet switching (Baran 1964, Davies 1965-66) is the deeper enabling tool and deserves its own card later; this card centers TCP/IP as the joining protocol and gives packet switching its due in the front. The 1974 paper described a single protocol; the TCP/IP split into two layers came in 1978, and 1983 is the cutover, so 1974 is the cleanest single date for the idea.
