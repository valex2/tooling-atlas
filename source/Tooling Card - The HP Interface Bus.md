---
Tags: tooling-card
Name: The HP Interface Bus
Kind: Measure
Tool: a passive cable and a three-wire handshake that lets a computer address a rack of instruments
Person: Don Loughry, Gerald Nelson and David Ricci
Place: Palo Alto, California, USA
City: Palo Alto
Lat: 37.44
Lon: -122.14
Era: 1970s
Year: 1972
Goal: Both
Mechanism: Pace-layers
Confidence: Direct
Unlocked: a rack of test instruments a program can drive
Significance: "One passive cable and a three-wire handshake let a computer call fifteen instruments by number, and HP licensed the patents cheaply enough that the whole trade built to it, which fixed the shape of the test bench for fifty years and earned HP nothing in rent."
BuildsOn:
  - "[[Tooling Card - The HP 200A Audio Oscillator]]"
  - "[[Tooling Card - The Triggered-Sweep Oscilloscope]]"
Enables:
Threads:
  - "[[Thread - Electronic Instruments]]"
  - "[[Thread - The Network]]"
---
*Measure · Palo Alto, California, USA · 1970s*
**Don Loughry, Gerald Nelson and David Ricci** · one cable that addresses fifteen instruments

**Front.** In 1972 Don Loughry was HP's corporate interface engineer, which meant his job was to stop the company's own divisions from shipping instruments that could not be plugged together. A voltmeter, a signal source and a printer each arrived with its own interface card, and the cards sat in a cage wired back to a single controller in a star. The codes disagreed as well. One instrument [sent a colon where the decimal point belonged](https://archive.org/stream/hp_journal_1972-10/hp_journal_1972-10_djvu.txt), so a calculator reading it had to break the number in two and glue it back together. Loughry's group moved the interface circuit inside each instrument and threw the cage out, leaving [a plain passive cable](https://archive.org/stream/hp_journal_1972-10/hp_journal_1972-10_djvu.txt) that reaches every box in parallel. Sixteen signal wires end in a 24-pin ribbon connector carrying a socket on its own back, so the plugs stack and you chain a rack together by feel. Three of the wires hold the talking discipline. The sender pulls one line to say the byte is good, and every listener holds a second line down until it has taken that byte, so the cable runs at the pace of its slowest box and nothing is dropped. A controller calls an address, names one talker and up to fourteen listeners, then stands back. [Fifteen instruments on twenty metres of cable](https://archive.org/stream/bitsavers_hphpib5940riptionoftheHewlettPackardInterfaceBusMa_1046026/59401-90030_Condensed_Description_of_the_Hewlett-Packard_Interface_Bus_Mar75_djvu.txt), about a megabyte a second, and a program could reach any of them by number.

**Back.** HP printed the design in the [October 1972 HP Journal](https://www.hpmemoryproject.org/wb_pages/wall_b_page_08.htm) and licensed the patents [for a nominal fee](https://en.wikipedia.org/wiki/IEEE-488); the IEEE published it as IEEE 488 in [1975](https://en.wikipedia.org/wiki/IEEE-488). By the end of that decade [more than 200 HP instruments](https://www.hpmemoryproject.org/wb_pages/wall_b_page_08.htm) spoke it, and so did boxes from Tektronix, Fluke and Keithley, and Commodore hung the same bus off the back of the [PET in 1977](https://en.wikipedia.org/wiki/IEEE-488) to run its disk drives. James Truchard, Jeff Kodosky and Bill Nowlin, three researchers at the University of Texas, took a [$10,000 bank loan](https://www.edn.com/national-instruments-history/), bought a PDP-11/04 and built a board that let it drive the bus; the company they started in an Austin garage to sell that board, National Instruments, [went to Emerson in 2023 for $8.2 billion](https://roboticsandautomationnews.com/2023/10/12/emerson-completes-8-2-billion-acquisition-of-national-instruments/72973/). HP gave the plug away and never collected rent on it. Ethernet took over new test racks after the [LXI standard arrived in 2005](https://www.testandmeasurementtips.com/what-is-gpib-and-is-it-obsolete/) and the old socket is a paid extra on most instruments now, though [Fluke still fits one to its 5522A calibrator](https://www.testandmeasurementtips.com/what-is-gpib-and-is-it-obsolete/) as standard.

