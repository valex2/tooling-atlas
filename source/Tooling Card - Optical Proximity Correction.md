---
Tags: tooling-card
Name: Optical Proximity Correction
Kind: Model
Tool: software that pre-distorts the mask
Person: Nicolas Cobb
Place: Berkeley, California, USA
City: Berkeley
Lat: 37.87
Lon: -122.27
Era: 1990s
Year: 1995
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: printing features smaller than the light
Significance: "Computing where the light will land let chipmakers draw deliberately wrong mask shapes that print right, which kept optical printing alive for twenty years below the wavelength."
BuildsOn:
  - "[[Tooling Card - Abbe's Diffraction Limit]]"
  - "[[Tooling Card - Photolithography]]"
  - "[[Tooling Card - Electronic Design Automation]]"
Enables:
  - "[[Tooling Card - The High-Yield Process Recipe]]"
Threads:
  - "[[Thread - Chip Lithography]]"
  - "[[Thread - Predict Before Building]]"
---
*Model · Berkeley, California, USA · 1990s*
**Nicolas Cobb** · software that pre-distorts the mask

**Front.** By the mid-1990s the light had started to lie. Fabs were printing [180-nanometer features with 248-nanometer light](https://www.semiconductoronline.com/doc/optical-lithography-lives-on-0001), so a clean rectangle on the stencil came out on the wafer with rounded corners and a line end that shrank back and missed the contact it was supposed to touch. The usual fix was a table of rules: if a line has a neighbor this close, draw it this much wider. Nicolas Cobb, a graduate student working under [Avideh Zakhor](https://www2.eecs.berkeley.edu/Pubs/TechRpts/1998/8059.html) at Berkeley, threw the table out and computed the light instead. His program cut every edge of the mask into short pieces, worked out how bright the wafer would be at a few points along each piece, nudged the piece, and checked again. He built the arithmetic as a [lookup of overlapping edges](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/2621/0000/Fast-sparse-aerial-image-calculation-for-OPC/10.1117/12.228208.full) rather than a full image, so on a Sun SPARC 10 one brightness point cost 6 milliseconds and each re-check after a nudge cost 26 microseconds. A nudge was now almost free, and the loop could be run over every edge on a whole chip.

**Back.** Masks stopped looking like circuits. They filled with hammerheads, little corner squares, and thin bars too fine to print at all, [shapes drawn wrong on purpose](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/2621/0000/Fast-sparse-aerial-image-calculation-for-OPC/10.1117/12.228208.full) so the wafer would come out right, and optical printing kept going for another twenty years below the wavelength it should have died at. In [November 1998](https://www.testandmeasurement.com/doc/mentor-acquires-optical-proximity-tool-compan-0001) Mentor Graphics bought Cobb's twelve-person company and folded the correction engine into Calibre, and IBM, TSMC, UMC and Chartered lined up to check it against real wafers. Working out one chip's mask set now takes [30 million hours of computing](https://nvidianews.nvidia.com/news/tsmc-synopsys-nvidia-culitho) or more; since March 2024 TSMC has run that arithmetic in production on 350 NVIDIA H100 systems in place of 40,000 machines of ordinary processors, and TSMC is the fab that prints the H100s.

