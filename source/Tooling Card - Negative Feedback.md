---
Tags: tooling-card
Name: Negative Feedback
Kind: Model
Tool: output fed back inverted to cancel error
Person: Harold Black
Place: New York, New York, USA
Lat: 40.71
Lon: -74.01
City: New York
Era: 1920s
Year: 1927
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: a machine that corrects its own error
Significance: "Black's trick of feeding an amplifier's output back inverted, trading raw gain for accuracy, became the principle under every stable amplifier and control loop, from transcontinental phone lines to the servo that holds a cutting tool on its path."
BuildsOn:
  - "[[Tooling Card - The Triode]]"
Enables:
  - "[[Tooling Card - Numerical Control]]"
Threads:
  - "[[Thread - Long-Distance Comms]]"
---
*Model · New York, USA · 1920s*
**Harold Black** · output fed back to cancel its own error

**Front.** On [2 August 1927](https://brewer.ece.gatech.edu/ece3043/FBBlack.pdf), a young Bell Labs engineer named [Harold Black](https://en.wikipedia.org/wiki/Harold_Stephen_Black) was riding the ferry across the Hudson to work. His problem was distortion. A phone signal fades over distance, so a long line needs amplifiers spaced along it, but every amplifier bends the sound a little, and stringing thousands across a continent piled the small errors up until the call was ruined. Engineers had spent years trying to build a tube that did not distort, and failed. Black's idea was to stop chasing a perfect tube: build an amplifier with far [more gain than the job needs, then feed part of its output back to the input the wrong way round](https://en.wikipedia.org/wiki/Negative-feedback_amplifier), so the amplifier reads its own error and cancels it. He had no paper, so he sketched the circuit on a [blank page of that morning's New York Times](https://en.wikipedia.org/wiki/Harold_Stephen_Black).

**Back.** Throwing away gain to buy accuracy let hundreds of repeaters run in a chain across the country without the distortion stacking up, and the same loop turned out to be the bones of almost every control system since: the thermostat, the autopilot, the [op-amp](https://en.wikipedia.org/wiki/Operational_amplifier), and the servo that keeps a cutting tool on its programmed path. [Bode and Nyquist at Bell Labs](https://en.wikipedia.org/wiki/Nyquist_stability_criterion) worked out the math of when such a loop stays stable, turning Black's trick into a standard tool of all engineering. The principle was published and patent-free for anyone to use (the Patent Office took [nine years to even grant it](https://en.wikipedia.org/wiki/Harold_Stephen_Black), not believing it worked), so like any open idea it gave Bell Labs prestige but no lasting moat; the advantage pooled downstream, in whoever built the best hardware with it.

*Curator's note:* **Placement.** Model cell, New York / Bell Labs, 1927, on the Bell Labs and Long-Distance Comms threads. Goal Both; Mechanism Convergence. Confidence Direct. It straddles Make (Black built an actual circuit), but the enduring tool is the *principle* of negative feedback, a non-rival published abstraction, so it files as Model. **Analysis.** This is the deck's second Bell Labs no-moat Model after [[Tooling Card - The Bit]]: a field-defining idea, published, that conferred prestige and not proprietary leadership, the lead pooling downstream in the makers. It is also the missing foundation under the deck's control lineage, the principle the servo loops in [[Tooling Card - Numerical Control]] and the later [[Tooling Card - The Mass-Produced CNC Controller]] all rest on, which is why it points forward to them. Cleanest example of the open-principle pattern, not an echo, because the romance of the moment (a flash on a ferry) is unusually well attested. **Nuance.** The classification straddle is real and worth keeping visible; if the deck ever wants a Make control card, the transistor-era [programmable logic controller](https://en.wikipedia.org/wiki/Programmable_logic_controller) (Modicon, 1969) is the candidate, and it would sit downstream of this one. The ferry-and-newspaper sketch is Black's own retelling, so treat the vivid detail as Plausible even though the invention and its 2 August 1927 date are Direct. Bode's and Nyquist's stability work came in the following years (Nyquist 1932, Bode through the 1930s-40s), not the same day.
