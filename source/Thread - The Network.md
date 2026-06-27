---
Tags: tooling-thread
Name: The Network
---
A throughline: how separate computers became one connected whole, and why no one owns it. It rests on two ideas. First, chop a message into small packets and let each find its own way, instead of holding a wire open for a whole call. Second, agree on one shared set of rules so networks built by different people can pass those packets to each other ([[Tooling Card - TCP-IP|TCP/IP]]). The thread's tools are mostly standards and protocols, things made to be copied, so they hand leadership to everyone and hold it nowhere; the value piles up at the edges, in the services and the data that ride on top. It is the digital sequel to [[Thread - Long-Distance Comms]], which carried analog signals over distance, and it feeds forward into the data that modern machine learning is trained on. Room to grow: packet switching, the router, Ethernet, and low-loss optical fibre are all nodes still to be added.

Cards on this thread, oldest first:

```dataviewjs
const cards = dv.pages("#tooling-card")
  .where(p => (p.Threads ?? []).some(t => t.path === dv.current().file.path))
  .sort(p => p.Year, "asc");
if (!cards.length) { dv.paragraph("_No cards on this thread yet._"); }
else {
  dv.table(["Card", "Year", "Place", "Kind", "Unlocked"],
    cards.map(p => [p.file.link, p.Year, p.Place, p.Kind, p.Unlocked]));
}
```
