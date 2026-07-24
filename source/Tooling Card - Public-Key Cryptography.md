---
Tags: tooling-card
Name: Public-Key Cryptography (RSA)
Kind: Model
Tool: RSA public-key cipher
Person: Rivest, Shamir, Adleman
Place: Cambridge, Massachusetts, USA
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
*Model · Cambridge, Massachusetts, USA · 1970s*
**Rivest, Shamir, Adleman** · a cipher with a public lock and a private key

**Front.** In April 1977 three MIT researchers, Ron Rivest, Adi Shamir, and Leonard Adleman, were stuck on a problem that Whitfield Diffie and Martin Hellman had named the year before in [New Directions in Cryptography](https://ee.stanford.edu/~hellman/publications/24.pdf): how do two strangers agree on a secret if anyone can listen to every word they send? Every cipher until then used one shared key, so the two had to meet first or trust a courier. Their answer was a pair of keys built from one big number, made by multiplying two huge prime numbers together: you hand out the number as a public lock that anyone can use to scramble a message to you, and only you keep the two primes that unlock it. The whole thing turns on a gap between two jobs: [multiplying the primes is easy, but pulling them back apart from the product is so slow](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) that no one can do it, so the lock can be printed in the open and stay safe.

**Back.** Martin Gardner printed one of their locks in [Scientific American in August 1977](https://simson.net/ref/1977/Gardner_RSA.pdf) with a $100 prize for anyone who could break it; it held until 1994, when about 600 volunteers on 1,600 machines finally factored the number after eight months. Browser makers and banks picked the cipher up, and a version of RSA now sits under the padlock on nearly every secure web page. A team at Britain's spy agency GCHQ had found the same trick a few years earlier, but classified it; they could neither use it nor say so, and the padlock that guards the modern web carries three MIT names, not theirs.

