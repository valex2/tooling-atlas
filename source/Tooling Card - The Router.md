---
Tags: tooling-card
Name: The Router
Kind: Make
Tool: a box that forwards packets toward their destination
Person: Frank Heart and the BBN team
Place: Cambridge, Massachusetts, USA
City: Cambridge
Lat: 42.39
Lon: -71.14
Era: 1960s
Year: 1969
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: separate computers wired into one switched network
Significance: "The IMP was a dedicated box that took in packets and forwarded each toward its destination, the first node of the ARPANET and the ancestor of every internet router."
BuildsOn:
  - "[[Tooling Card - Packet Switching]]"
Enables:
  - "[[Tooling Card - Ethernet]]"
  - "[[Tooling Card - TCP-IP]]"
Threads:
  - "[[Thread - The Network]]"
---
*Make · Cambridge, Massachusetts, USA · 1960s*
**Frank Heart and the BBN team** · a small box that forwards packets

**Front.** In 1969 a small Cambridge firm, [Bolt Beranek and Newman](https://goodscienceproject.org/articles/the-third-university-of-cambridge-bbn-and-the-development-of-the-arpanet/), took an ARPA contract to wire a handful of distant computers into one network. The trouble was that the machines were made by different companies and spoke different languages, and the phone lines between them could only hold a message in one piece. [Frank Heart's team](https://whomadetheinternet.com/frank-heart-and-bbn-team/) took a [ruggedized Honeywell DDP-516 minicomputer](https://en.wikipedia.org/wiki/Interface_Message_Processor) and wrote about six thousand words of code that did one job: take in a message, chop it into small blocks, read the address on each block, and pass it down a [50-kilobit-per-second leased line](https://en.wikipedia.org/wiki/ARPANET) toward the next box. For the first time a separate machine sat between the big computer and the wire and did nothing but read addresses and forward.

**Back.** BBN [delivered the first box to Leonard Kleinrock's lab at UCLA on 30 August 1969](https://www.livescience.com/technology/communications/science-history-first-computer-to-computer-message-lays-the-foundation-for-the-internet-but-it-crashes-halfway-through-oct-29-1969), and on the night of 29 October the first message crossed two of them, from UCLA toward Stanford, and crashed after two letters: [lo](https://paleofuture.com/blog/2014/7/3/the-first-internet-message-ever-sent-was-lo). They called it the Interface Message Processor, and three more shipped that year to build the first four-node ARPANET. The job that box did, take a packet and forward it, is the job every internet router on Earth still does today.

