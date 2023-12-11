# 2023 - Day 11

[https://adventofcode.com/2023/day/11](https://adventofcode.com/2023/day/11)

After a bit of trickery yesterday, it felt good to do it properly today.
Luckily, nothing too scary here. The twist was expanding galaxies, meaning
you couldn't jsut construct a new grid, but the solution was obvious; count
the distances step by step rather than in one-go with maths.

I suspect I still can find a way to do it in one go with maths, I just need
a trifle more cleverness. But I'm a little sick, so I'm going back to bed.

Oh, and my Part 1 solution involved actually expaning the grid. This required
just a little fun with flatmaps, so I'm keeping the code around. :)

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2023/11-cosmic-expansion/index.ts
```
