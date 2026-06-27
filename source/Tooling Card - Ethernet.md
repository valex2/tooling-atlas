---
Tags: tooling-card
Name: Ethernet
Kind: Make
Tool: Shared-cable listen-and-back-off scheme
Person: Robert Metcalfe and David Boggs
Place: Palo Alto, USA
City: Palo Alto
Lat: 37.40
Lon: -122.15
Era: 1970s
Year: 1973
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: many computers sharing one local wire
Significance: "It let a room full of computers share one cable by taking turns, and became the way local networks were wired."
BuildsOn:
  - "[[Tooling Card - The Router]]"
Enables:
  - "[[Tooling Card - TCP-IP]]"
Threads:
  - "[[Thread - The Network]]"
---
*Make · Palo Alto, USA · 1970s*
**Robert Metcalfe and David Boggs** · one cable, take turns, back off on a clash

**Front.** In 1973 Robert Metcalfe and David Boggs worked at Xerox's [Palo Alto Research Center](https://spectrum.ieee.org/ethernet-ieee-milestone), where the new Alto computers and a fast laser printer needed a way to talk to each other. Many machines on one wire will talk over each other, and a clash garbles both messages. Their fix was a set of rules a machine follows before and during a send: listen to the cable first, send only when it is quiet, and if two send at once and collide, each waits a random little gap and tries again. It first ran on [May 22, 1973](https://en.wikipedia.org/wiki/Ethernet) at [2.94 megabits per second](https://spectrum.ieee.org/ethernet-ieee-milestone) over a single coaxial cable, and Metcalfe named it Ethernet.

**Back.** In 1980 Xerox, [Intel, and Digital](https://spectrum.ieee.org/ethernet-ieee-milestone) published a faster 10-megabit version, and the IEEE made it the 802.3 standard in 1983. On that thick-cable version, devices clipped onto the wire with [vampire taps](https://spectrum.ieee.org/ethernet-ieee-milestone), small probes that pierced the insulation so you could add a machine without cutting the cable. The take-turns-on-one-wire idea spread to nearly every office and home network, and the lead compounded.

