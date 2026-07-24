---
Tags: tooling-card
Name: The Datagram
Kind: Model
Tool: connectionless packet design
Person: Louis Pouzin
Place: Rocquencourt, France
City: Rocquencourt
Lat: 48.82
Lon: 2.16
Era: 1970s
Year: 1973
Goal: 1
Mechanism: Convergence
Confidence: Direct
Unlocked: Self-addressed packets on a dumb network let unlike networks interconnect
Significance: "The connectionless packet kept the network simple and put the checking at the ends: TCP/IP adopted the design, and every Internet packet still routes itself."
BuildsOn:
  - "[[Tooling Card - Packet Switching]]"
Enables:
  - "[[Tooling Card - TCP-IP]]"
Threads:
  - "[[Thread - The Network]]"
---
*Model · Rocquencourt, France · 1970s*
**Louis Pouzin** · connectionless packets on a dumb network

**Front.** In 1973, [Louis Pouzin](https://en.wikipedia.org/wiki/Louis_Pouzin) was building France's first computer network, CYCLADES, at the IRIA computing lab in Rocquencourt outside Paris, with a small team and far less money than America had put into ARPANET. The accepted way to link computers made the network set up a path for each conversation and guarantee every message arrived, which took big, costly switches. Pouzin [cut the network's job to almost nothing](https://dl.acm.org/doi/10.1145/800280.811034): each packet carried its full destination address on its face, like a telegram (which is how the datagram got its name), so a switch only had to read the address and pass the packet on, while the computers at the two ends kept count and asked again for anything lost. In [November 1973](https://en.wikipedia.org/wiki/CYCLADES) the first demonstration ran with three host computers and one switch, the first network ever to make the hosts, and never the network, responsible for getting data through.

**Back.** The next year [Vint Cerf and Bob Kahn](https://ieeexplore.ieee.org/document/1092259) folded the self-addressed packet and its end-to-end checking into TCP, the design that joins unlike networks into the Internet, and Cerf [named Pouzin's work](https://en.wikipedia.org/wiki/Louis_Pouzin) among its sources. At home the French phone monopoly backed the opposite design, the call-style Transpac network, refused to fund a rival, and CYCLADES was [shut down by 1981](https://en.wikipedia.org/wiki/CYCLADES). Every packet on the Internet still carries its own address, and in [2013](https://qeprize.org/winners/louis-pouzin) Pouzin shared the first Queen Elizabeth Prize for Engineering with Cerf and Kahn, honoured abroad for a design his own government had stopped paying for.

