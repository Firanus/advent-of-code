# 2022 - Day 19

[https://adventofcode.com/2022/day/19](https://adventofcode.com/2022/day/19)

After a day away from solving a strict optimization problem, we're back, to
something that initially looked like it very closely resembled Day 16. Queue terror.

In actuality, I found this problem way more approachable. That's possibly just because
I'd already spent so long on Day 16, so I had ideas for ways to optimise it. :P

Weirdly, one of the key optimization choices I made on this problem (to cut out any
options that had less geodes at a time than a previously seen timestep) actually
breaks the algorithm for the test input. HOWEVER, it works for my main input. So
screw it, I lucked out. :P

Might look for something more general later, but not holding my breath. Also,
worth noting the current solution takes **about 23 s** to run. I've left in
a log of queue size to provide a sense of progress.

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2022/18-boiling-boulders/index.ts
```
