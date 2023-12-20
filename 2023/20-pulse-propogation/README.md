# 2023 - Day 20

[https://adventofcode.com/2023/day/20](https://adventofcode.com/2023/day/20)

What a fancy little problem today. First part involved some really nuanced
parsing to propogate pulses through a series of gates. The terminology here
(flipflops, conjunction etc.) suggests to me that this is inspired by computer
gates, and I look forward to digging in later to figure out exactly how
closely the relationship goes.

Part 2 was a stumper. I _thought_ it would involve cycle calculations, so
I did a bit of pre-optimization around that. But no, I was wrong, instead it
asks you when one specific gate gets a particular input. Which, as it turns out
takes a looooong time.

Luckily, this problem looked graphy, and I'd played around with GraphViz before
(God Bless that Sunday morning), so I chucked the graph in there, and it became
clear that it was essentially 4 graphs. It still took me a bit of puzzling to
realise that I should treat them individually. But I got there, and started like
that.

Thing is, I couldn't get RX to trigger even on a tiny graph. This confused me greatly,
but my old cycle code ended up helping. I hooked it up, and saw I was getting a
cycle every 4000 or so. Well, I tidied up the code there til I was certain of cycle
lengths, and figured why not try just multiplying them together. And lo and behold,
I got the star!

This felt wrong though, so I went back and figured out what was wrong with my code
(my submodule generation wasn't setting up the CS node properly, it turns out). Now
it works all correctly.

One more thing, because I found graphs so useful, I've attached the images I used here
too. The code for generating them is at the bottom of Part 2. :D

To solve part 1, run the following from the project root:

```sh
npx ts-node 2023/20-pulse-propogation/part1.ts
```

To solve part 2, run the following from the project root:

```sh
npx ts-node 2023/20-pulse-propogation/part2.ts
```
