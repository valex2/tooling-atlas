---
Tags: tooling-card
Name: The Bombe
Kind: Make
Tool: spin through Enigma settings until logic holds
Person: Alan Turing
Place: Bletchley Park, England
City: Bletchley
Lat: 51.99
Lon: -0.74
Era: 1940s
Year: 1940
Goal: 1
Mechanism: Pace-layers
Confidence: Direct
Unlocked: ruling out millions of Enigma settings by machine
Significance: "The Bombe could be shown to anyone, but the guarded secret was the capability itself, that German traffic was being read, and that secret held for about thirty years even as Britain let other nations keep using Enigmas it could break."
BuildsOn:
Threads:
  - "[[Thread - Software Abstraction]]"
---
*Make · Bletchley Park, England · 1940s*
**Alan Turing** · spin through Enigma settings until logic holds

**Front.** On 14 March 1940 a machine called [Victory](https://www.tnmoc.org/bombe) started running at Bletchley Park, built to Alan Turing's design and later sharpened by a fix from **Gordon Welchman**. The German Enigma scrambled each letter through spinning rotors and a swap-board, giving so many start positions that testing them by hand was hopeless. The Bombe attacked the pile with a guess. Codebreakers found a [crib](https://en.wikipedia.org/wiki/Cryptanalysis_of_the_Enigma), a stretch of plain text they expected in a message (German weather reports often carried known words), and the machine spun through rotor positions, stopping the instant the wiring led to a contradiction, so a clerk only hand-checked the few settings left. Welchman's [diagonal board](https://en.wikipedia.org/wiki/Bombe), running in an improved machine from August 1940, wired in the swap-board's own symmetry. If B is plugged to G then G is plugged to B. That shortcut cut the work from days to hours and made short cribs workable.

**Back.** The breaks fed an intelligence stream the Allies code-named [Ultra](https://en.wikipedia.org/wiki/Ultra_(cryptography)), and by 1945 more than 200 Bombes were running. The machines could have sat in a shop window and told the enemy nothing useful; the thing worth hiding was that Enigma was being read at all, so the guard was placed on the capability, not the hardware. That secret held for about [thirty years](https://drenigma.org/2021/09/21/who-spilt-the-beans-how-the-enigma-secret-was-revealed/), until F. W. Winterbotham's 1974 book, and Britain used the silence: it [handed surplus Enigmas to former colonies](https://drenigma.org/2022/03/02/did-britain-sell-enigmas-postwar/) as they gained independence, let them trust the machine, and quietly read their traffic for years.

*Curator's note:* **Placement.** Make cell, Goal 1, Pace-layers, Direct confidence: a one-off machine built to test and rule out settings, not yet a production line. **Analysis.** A rare card where the tool and the secret split cleanly. The Bombe is open electromechanical logic, copyable on sight, so it never carried the moat; the moat was the slow-moving secret riding above it, the fact of the break, which is the pace-layers reading. **Nuance.** "Victory" is firmly dated to 14 March 1940; Welchman's diagonal board came in an improved machine that August and made short cribs workable. The 200-plus Bombe count and the ~30-year secret are well sourced. The postwar Enigma-to-colonies story is repeated by Kahn and Aldrich but rests on thin primary evidence, so I state it as what Britain did, not a proven decree. **Secrecy:** held — the guarded thing was never the machine's design but the capability that Enigma was broken, and that secret survived the war by three decades while Britain harvested traffic from nations still trusting Enigma.
