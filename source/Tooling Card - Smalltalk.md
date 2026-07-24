---
Tags: tooling-card
Name: Smalltalk
Kind: Model
Tool: programs built from objects that send messages
Person: Alan Kay
Place: Palo Alto, California, USA
Lat: 37.44
Lon: -122.14
City: Palo Alto
Era: 1970s
Year: 1972
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: the object as the unit of software
Significance: "Smalltalk made the object, a small bundle of data plus the code that acts on it, the building block of software, a way of writing programs that almost every modern language went on to copy."
BuildsOn:
  - "[[Tooling Card - FORTRAN]]"
  - "[[Tooling Card - Sketchpad]]"
  - "[[Tooling Card - The Self-Hosting Compiler]]"
Threads:
  - "[[Thread - Software Abstraction]]"
---
*Model · Palo Alto, California, USA · 1970s*
**Alan Kay** · software made of objects that send messages

**Front.** A program in the early 1970s was still mostly a long list of steps that pushed raw data around, and big ones grew into a tangle no one could hold in their head. At [Xerox PARC](https://en.wikipedia.org/wiki/Smalltalk), a researcher named [Alan Kay](https://en.wikipedia.org/wiki/Alan_Kay) had a different picture: let the program be made of many small parts, each one holding its own data and the code that works on it, and let them get things done by [sending messages to each other](https://www.purl.org/stefan_ram/pub/doc_kay_oop_en). In [September 1972 he bet it could be built in about a page of code](https://en.wikipedia.org/wiki/Smalltalk), and within about a week Dan Ingalls had a working version running. Kay called the parts objects, and the whole way of working [object-oriented](https://en.wikipedia.org/wiki/Alan_Kay).

**Back.** The idea was that each object was like a tiny computer, hiding its own insides and offering only a few messages it would answer, so you could build something huge without any one part needing to know how the others worked. That way of taming size spread into almost every language that followed, from C++ to Java to the object model inside Python. Smalltalk also grew up beside the first windows-and-mouse screen at PARC and shaped how those were built. PARC published the idea and reaped the prestige; the companies that turned objects into the default way the world writes software, decades on, were Sun with Java and the open Python project, not Xerox.

