---
Tags: tooling-card
Name: The Relational Model
Kind: Model
Tool: data as plain tables queried by logic
Person: Edgar Codd
Place: San Jose, California, USA
Lat: 37.34
Lon: -121.89
City: San Jose
Era: 1970s
Year: 1970
Goal: Both
Mechanism: Convergence
Confidence: Direct
Unlocked: ask a database a question without knowing where the data sits
Significance: "Codd's relational model stored data as plain tables you could question by logic instead of by knowing where each record physically sat, the idea under almost every database since."
BuildsOn:
  - "[[Tooling Card - The Punch Card]]"
Threads:
  - "[[Thread - Software Abstraction]]"
---
*Model · San Jose, USA · 1970s*
**Edgar Codd** · data as tables you question by logic

**Front.** By 1970 a company's data lived in files threaded together by pointers, so to pull anything out a programmer had to know exactly where it sat and how to walk the path to it. Change the storage and every program broke. [Edgar Codd](https://www.ibm.com/history/edgar-codd), a mathematician at IBM's San Jose lab, wrote a [paper that year](https://en.wikipedia.org/wiki/Edgar_F._Codd) proposing something cleaner: keep the data in plain [tables](https://www.ibm.com/history/relational-database), rows and columns, and let a person ask for what they want by stating the logic of it, while the machine works out how to fetch it. The new thing was the split: the question you ask is separated from where the bytes actually live.

**Back.** IBM was slow to build it, not wanting to undercut the database it already sold, so a [team only took it on in 1973](https://www.ibm.com/history/relational-database) as System R, where Don Chamberlin and Raymond Boyce wrote the query language that became SQL. The clean idea then walked out the door: [Larry Ellison's firm shipped the first commercial relational database in 1979](https://en.wikipedia.org/wiki/Edgar_F._Codd), ahead of IBM's own product. Codd's tables are now the shape of nearly every business database in the world. The model was published and free, so it gave IBM no moat, and the lead went to whoever shipped it first.

*Curator's note:* **Placement.** Model cell, IBM San Jose, 1970, on the [[Thread - Software Abstraction]] stack. Goal Both; Mechanism Convergence. Confidence Direct. **Analysis.** A sibling no-moat software Model to [[Tooling Card - FORTRAN]] and [[Tooling Card - Smalltalk]]: where FORTRAN hid the machine and Smalltalk hid a program's complexity, the relational model hid the physical storage behind a logical table. It is one of the deck's cleanest invented-here-captured-elsewhere stories, the same shape as the migration cards: IBM held the idea, Oracle took the lead, exactly because a published model is non-rival and the advantage pools in whoever builds and sells it fastest. **Nuance.** Codd's 1970 paper is the dated moment; System R (1973) and SQL come later, and Oracle's 1979 release is the commercial first. The card BuildsOn [[Tooling Card - The Punch Card]] as the physical-data era it abstracted away from, a loose lineage rather than a direct technical dependency.
