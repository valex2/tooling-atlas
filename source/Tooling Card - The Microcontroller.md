---
Tags: tooling-card
Name: The Microcontroller
Kind: Make
Tool: the microcontroller
Person: Gary Boone and the TI team
Place: Dallas, Texas, USA
Lat: 32.78
Lon: -96.8
City: Texas
Era: 1970s
Year: 1974
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: a cheap computer embedded in everything
Significance: "Collapsing a whole computer onto one $2 chip let manufacturers hide programmable intelligence inside any product, from toys to machine-tool controllers, and the lead migrated to whoever built the cheapest capable version."
BuildsOn:
  - "[[Tooling Card - The Microprocessor]]"
Enables:
  - "[[Tooling Card - The Mass-Produced CNC Controller]]"
Threads:
  - "[[Thread - Electronic Switching]]"
---
*Make · Texas, United States · 1970s*
**Gary Boone and the TI team** · a whole computer on one chip

**Front.** A computer used to be a roomful of parts. In the early 1970s a young engineer at Texas Instruments named [Gary Boone](https://www.computerhistory.org/siliconengine/general-purpose-microcontroller-family-is-announced/) was asked to shrink a calculator, and he kept going past the question. Working with Michael Cochran, he put the thinking part, the part that remembers the steps, the part that holds the numbers, and the wires that talk to the outside world all on [one piece of silicon](https://en.wikipedia.org/wiki/Texas_Instruments_TMS1000). The team had the first one working in the [early hours of July 4, 1971](https://www.computerhistory.org/siliconengine/general-purpose-microcontroller-family-is-announced/). By 1974 they sold it as the [TMS1000](https://en.wikipedia.org/wiki/Texas_Instruments_TMS1000). The new thing was not that it could compute. The new thing was that a whole little computer was now one cheap part, about [two dollars](https://en.wikipedia.org/wiki/Texas_Instruments_TMS1000) when you bought a lot of them, small enough to drop inside almost anything.

**Back.** Once the brain was that cheap, people started hiding it everywhere, in [toys, games, alarms, and garage doors](https://www.computerhistory.org/siliconengine/general-purpose-microcontroller-family-is-announced/), and by 1979 about [26 million of them](https://en.wikipedia.org/wiki/Texas_Instruments_TMS1000) sold every year. Intel followed with its own embedded brains, the [8048 in 1976](https://en.wikipedia.org/wiki/Intel_MCS-48) and then the [8051](https://en.wikipedia.org/wiki/Intel_MCS-51), which still runs in countless machines today. The same cheap brain went into machine-tool controllers, where Japan's [FANUC](https://en.wikipedia.org/wiki/FANUC) built it into a [low-cost control system in 1976](https://www.cncspares.com/fanuc/fanuc-history/) and took that lead away. The chip spread and became the quiet thing inside almost every machine that does anything.

*Curator's note:* **Placement.** Make cell, US row, Texas, 1974. Serves Goal 1 (the embed-everywhere capability rides entirely on the tool being cheap and whole) and Goal 2 (the brain-for-machines lead does not stay at TI; it hands off to Intel's embedded line and then to FANUC in Japan for machine control), so Both. Mechanism: Convergence, the cleanest small-scale case in the deck, four separate computer parts collapsing onto one die. Confidence: direct on the tool, the date, the price, and the volume; the FANUC handoff is plausible-to-direct (FANUC's 1976 System 5 adopts LSI microprocessor plus ROM plus RAM, but the specific chip family is not the TMS1000). **Analysis.** This is a Parade card, not a Hero: it fills out the breadth of the Make cell and the embedded-brain story rather than carrying the argument alone. It pairs 1:1 with [[Tooling Card - The Microprocessor]], the microprocessor, as the two halves of the chip's split personality: the microprocessor is the bare mind that needs a board around it, the microcontroller is the whole self-contained computer you embed and forget. Together they set up the FANUC handoff, where the cheap brain becomes the cheap CNC, which is why this card hands off explicitly to FANUC rather than dwelling on it. On [[Thread - Electronic Switching]] it is the late beat where the switch-built logic finally folds into a single throwaway part. It is the cleanest convergence example at small scale, but a weaker echo of [[Tooling Card - The EUV Machine]] on the larger thesis, since the microcontroller's moat did not last (the design got copied freely, which is the whole point of why it spread). **Nuance.** Dating is the fiddly part. The first working single-chip device was 1971 (the TMS1802 calculator chip), but the general-purpose, buy-it-by-the-million TMS1000 family was announced in 1974, so the card pins the moment at 1974 and the prototype at July 4, 1971. The patent fight: Boone and Cochran's computer-on-a-chip patent (US 4,074,351, filed 1977, issued 1978) was later contested by Gilbert Hyatt, whose 1990 single-chip patent was canceled after a long interference, with the USPTO affirming Boone as the inventor; this is back-history, kept off the face to hold the front to one moment. The $2 figure is the 1974 volume price; 26 million per year is the 1979 figure. "First true microcontroller" is contested between TI's 1971 prototype and TI's 1974 commercial family; sources split on which gets the title, so the card claims the commercial-family-as-cheap-part beat, not a bare first.
