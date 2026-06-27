---
Tags: tooling-card
Name: Public-Key Cryptography (RSA)
Kind: Model
Tool: RSA public-key cipher
Person: Rivest, Shamir, Adleman
Place: Cambridge, USA
City: Cambridge
Lat: 42.36
Lon: -71.09
Era: 1970s
Year: 1977
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: strangers can talk in secret without sharing a key first
Significance: "RSA let two people who never met agree on a secret in the open, the trick that now guards almost every web page and bank login."
BuildsOn:
  - "[[Tooling Card - The Bit]]"
Enables:
Threads:
  - "[[Thread - The Network]]"
---
*Model · Cambridge, USA · 1970s*
**Rivest, Shamir, Adleman** · a cipher with a public lock and a private key

**Front.** In April 1977 three MIT researchers, Ron Rivest, Adi Shamir, and Leonard Adleman, were stuck on a problem that Whitfield Diffie and Martin Hellman had named the year before in [New Directions in Cryptography](https://ee.stanford.edu/~hellman/publications/24.pdf): how do two strangers agree on a secret if anyone can listen to every word they send? Every cipher until then used one shared key, so the two had to meet first or trust a courier. Their answer was a pair of keys built from one big number, made by multiplying two huge prime numbers together: you hand out the number as a public lock that anyone can use to scramble a message to you, and only you keep the two primes that unlock it. The new thing was the gap between the two jobs: [multiplying the primes is easy, but pulling them back apart from the product is so slow](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) that no one can do it, so the lock can be printed in the open and stay safe.

**Back.** Martin Gardner printed one of their locks in [Scientific American in August 1977](https://simson.net/ref/1977/Gardner_RSA.pdf) with a $100 prize for anyone who could break it; it held until 1994, when about 600 volunteers on 1,600 machines finally factored the number after eight months. Browser makers and banks picked the cipher up, and a version of RSA now sits under the padlock on nearly every secure web page. The lead held because the idea was published and built into a usable system. A team at Britain's spy agency GCHQ had found the same trick a few years earlier and could neither use it nor say so, so it bought them nothing.

*Curator's note:*
(1) Placement: Model cell, Goal Both (it both secures traffic and proves who you are), mechanism Convergence, confidence Direct. The card is tool-forward: the instrument is the RSA cipher, not the abstract notion of public keys.
(2) Analysis: This is a model in the deck's sense, a published abstraction that anyone can copy, so the moat does not sit in the cipher itself. The interesting twist is the GCHQ counterpoint on the face: James Ellis sketched "non-secret encryption" and Clifford Cocks wrote down essentially RSA at GCHQ around 1973, classified, [declassified only in 1997](https://www.nsa.gov/History/Cryptologic-History/Historical-Figures/Historical-Figures-View/Article/3006218/clifford-cocks-james-ellis-and-malcolm-williamson/). Leadership followed the people who published and shipped, not the people who were first. Pairs with [[Tooling Card - The Bit]] (the prior model whose non-rival idea travelled freely) and feeds [[Tooling Card - The Web]] and [[Tooling Card - TCP-IP]] as the secrecy and identity layer the open network needed.
(3) Nuance: Diffie-Hellman (1976) framed the public-key idea and a key-exchange method; RSA (1977) was the first practical full encrypt-and-sign system, so the deck credits RSA as the tool while the front credits Diffie-Hellman with the framing. The $100 challenge number was RSA-129; Rivest's 1977 estimate that factoring it would take [40 quadrillion years](https://en.wikipedia.org/wiki/The_Magic_Words_are_Squeamish_Ossifrage) was wildly off because better factoring algorithms arrived, which is the honest caveat: the safety rests on a hardness assumption, not a proof. GCHQ attribution (Ellis/Cocks/Williamson) is well documented but the exact internal dates rest on later GCHQ accounts.
