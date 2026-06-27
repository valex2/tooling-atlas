---
Tags: tooling-card
Name: The Mass-Produced CNC Controller
Kind: Manufacture
Tool: cheap off-the-shelf CNC controller and position encoder
Person: Seiuemon Inaba, Fujitsu FANUC
Place: Tokyo, Japan
Lat: 35.69
Lon: 139.69
City: Tokyo
Era: 1956-82
Year: 1956
Goal: 2
Mechanism: Convergence
Confidence: Direct
Unlocked: cheap mass-produced machine brains; Japan takes the machine-tool lead
Significance: "The controller is the brain that reads a program and drives a cutting machine to a thousandth of an inch, and making it cheap and off-the-shelf handed the machine-tool lead from the country that invented it to the country that mass-produced it."
BuildsOn:
  - "[[Tooling Card - Numerical Control]]"
  - "[[Tooling Card - The Microcontroller]]"
Enables:
  - "[[Tooling Card - The Machine-Tool VRA]]"
Threads:
  - "[[Thread - Machine Tools]]"
---
*Manufacture · Tokyo, Japan · 1956-82*
**Seiuemon Inaba, Fujitsu FANUC** · cheap off-the-shelf machine brain

**Front.** A cutting machine has a tool that bites into metal and motors that slide it along each axis. The box that tells those motors where to go is the controller. In [1956](https://www.fanuc.co.jp/en/profile/history/), a young engineer named [Seiuemon Inaba](https://www.fanuc.co.jp/en/profile/history/) at the Japanese phone-equipment maker Fujitsu built one. It reads a list of numbers, a program, and turns each line into a command to a motor; a small sensor on the shaft, an [encoder](https://www.quantumdev.com/optical-encoder-applications/cnc-machining/), keeps reporting back where the tool actually is, so the box can correct itself until the cut lands within a [thousandth of an inch](https://www.quantumdev.com/optical-encoder-applications/cnc-machining/). American shops had boxes like this too, but each one was hand-built, a one-off, costing a fortune. The new thing was not the cutting. It was making that brain a [standard part](https://en.wikipedia.org/wiki/FANUC), stamped out by the thousand, cheap enough to bolt onto any plain machine.

**Back.** At the start the [ten biggest makers of these control boxes were all American](https://en.wikipedia.org/wiki/FANUC). Then the lead crossed the Pacific. Other Japanese builders (Mazak, Mori Seiki, Okuma) dropped Inaba's cheap brain into their machines, and by [1982 FANUC alone held half the world's CNC market](https://en.wikipedia.org/wiki/FANUC); Japan passed the United States as the biggest maker of machine tools, a spot it [held for 27 years](https://www.nippon.com/en/currents/d00007/), and about half of America's machine-tool firms closed. The surrender was plain: in 1986 [General Electric stopped building its own controls and turned its Charlottesville, Virginia plant over to making FANUC's](https://en.wikipedia.org/wiki/FANUC). The body of a machine became something anyone could weld; the brain stayed the part that mattered, and one company now sits inside about [65 percent](https://en.wikipedia.org/wiki/FANUC) of the world's computer-run machines.

*Curator's note:* **Placement.** Cell: Manufacture · Japan · 1956. Goal 2, mechanism Convergence. I moved the Kind from Make to **Manufacture** on the reframe: the card is no longer about building one controller (the invention is American, on the NC card) but about turning the controller into a cheap stamped-out product, and that act of mass manufacture is the whole point. Confidence: **Direct.** The 1982 half-the-market figure, the "ten largest CNC firms were American" setup, the GE Charlottesville handover, and the ~65% current share all come from FANUC's Wikipedia entry; the 1982 overtaking and the 27-year reign are from Nippon.com.

**Analysis.** Reframed off the firm and onto the tool: the front now opens on the controller box and the physical loop (program in, motor command out, encoder reports position back, box corrects to a thousandth of an inch) before any company name. This is the deck's clearest **commoditize-the-brain** card and the deliberate twin to the NC-invention card. America holds the invention; Japan holds the cheap *manufacture* of it. It keeps its chokepoint point as a property of the tool, not the firm: the controller is the brain every other builder still buys, so whoever stamps it out cheapest holds the machine-tool lead. Threads: Machine Tools. It echoes the Gauge migration card (leadership follows the toolmaking) but inverts the polarity: the standard compounds in place rather than migrating onward, because the maker kept improving the box faster than rivals could copy it.

**Nuance.** "Half the world CNC market by 1982" and "~65% today" are different snapshots, not a contradiction; the 1982 figure marks the lost-lead moment, the ~65% the present grip. The founding year is genuinely fuzzy: Fujitsu formed the NC project team in **1955**, achieved Japan's first private-sector NC in **1956** (the date used here and FANUC's own milestone), shipped its first commercial NC in **1958**, built the electro-hydraulic pulse motor (its early servo) in **1959**, spun out as Fujitsu Fanuc in **1972**, and renamed to FANUC in **1982**. I anchored the front on 1956 to match FANUC's history page; the pulse motor is the real hardware heart of the early servo but too in-the-weeds for the front, so it sits compressed as "a motor." FANUC = **Fu**ji **A**utomatic **Nu**merical **C**ontrol. Sourcing trail: [FANUC corporate history](https://www.fanuc.co.jp/en/profile/history/), [FANUC Wikipedia](https://en.wikipedia.org/wiki/FANUC), [Quantum Devices on CNC encoders](https://www.quantumdev.com/optical-encoder-applications/cnc-machining/), [Nippon.com on Japan's machine-tool rise](https://www.nippon.com/en/currents/d00007/).
