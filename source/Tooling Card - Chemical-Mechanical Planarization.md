---
Tags: tooling-card
Name: Chemical-Mechanical Planarization
Kind: Manufacture
Tool: polishing a wafer flat between layers
Person: Klaus Beyer
Place: East Fishkill, New York, USA
City: East Fishkill
Lat: 41.55
Lon: -73.79
Era: 1980s
Year: 1983
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: many-layer chips and copper wiring
Significance: "Pressing a patterned wafer face-down on a spinning pad under a tuned slurry flattens each layer before the next one is printed, which is what lets a chip carry a dozen stacked layers and what lets copper wires be made at all."
BuildsOn:
  - "[[Tooling Card - Photolithography]]"
  - "[[Tooling Card - The Wafer Stepper]]"
Enables:
  - "[[Tooling Card - The EUV Machine]]"
  - "[[Tooling Card - The High-Yield Process Recipe]]"
Threads:
  - "[[Thread - Wafer Processing]]"
  - "[[Thread - Chip Lithography]]"
---
*Manufacture · East Fishkill, New York, USA · 1980s*
**Klaus Beyer** · polishing a wafer flat between layers

**Front.** In January 1983 [Klaus Beyer](https://nccavs-usergroups.avs.org/wp-content/uploads/2024/12/CMPUG1224-Ses-1.1-BeyerK-RobertsB.pdf), a chemist at IBM's plant in East Fishkill, New York, was lent part-time to a team stuck on a bumpy surface. Trenches cut into the wafer were filled with glass and the glass was warmed until it flowed, which smoothed it over a short span and left humps over a wide one. Every layer printed on top inherited those humps and added its own, and the printer could not hold hills and valleys in focus at once. Beyer carried one glass-covered trench wafer down to the polishing tables where IBM flattened bare silicon before any circuit went on it, pressed it face-down on the spinning pad under abrasive slurry, then cleaned the slurry off with the sound-wave bath he had spent two years learning. Under the microscope the glass was flat. "For two weeks I kept these results to myself," he wrote. "I was fully aware that I was successfully using an unacceptable, dirty process." The pad grinds, but the liquid does half the work, softening the surface so the grit can lift it, and tuning the liquid picks what comes off: in the [patent IBM filed in October 1985](https://patents.google.com/patent/US4944836A/en) an alumina slurry held at pH 2.2 took aluminium-copper about 13 times faster than the oxide under it, where the same alumina in plain water took both at the same rate. High spots touch the pad first, so they go first, and the wafer comes out level rather than merely thinner.

**Back.** IBM ran the polish on device wafers for about ten months, found nothing wrong, and let it onto product; by 1988 the [4Mb DRAM was in production with chemical-mechanical polishing of its insulators](http://bitsavers.informatik.uni-stuttgart.de/pdf/ibm/IBM_Journal_of_Research_and_Development/391/adler.pdf). Through the rest of the 1980s IBM said almost nothing about it, [limiting talk to those with a need to know](https://go.gale.com/ps/i.do?asid=8e348c2c&id=GALE%7CA19555341&it=r&p=AONE&sid=AONE&u=googlescholar&v=2.1) while its people sat quietly through conference sessions taking notes, and the two toolmakers building IBM's custom polishers, Strasbaugh and Westech, were never told what the modifications were for. Those toolmakers sold to everyone else, and by the mid-1990s the polish was ordinary practice in every advanced fab. It is also the reason chips are wired in copper: copper will not etch into fine lines, so from [IBM's 1997 process](https://research.ibm.com/blog/beol-cu-interconnects-iedm) onward the trenches are cut first, copper is flooded over the whole wafer, and the excess is polished away, a method still standard 27 years later. The 1985 patent named ten inventors and IBM told nobody outside; the wafers it describes are now polished in Hsinchu and Pyeongtaek.

