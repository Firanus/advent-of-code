# 2022 - Day 24

[https://adventofcode.com/2022/day/24](https://adventofcode.com/2022/day/24)

Fun problem as the last full one of 2022. Again works out as a pathfinding problem
on a changing grid. However, while the grid changes, it changes in a consistent
fashion.

So, first step was creating the complete set of maps. This is actually overkill
for the problem, as they never loop in the real input, but it probably works out
as an optimization overall nonetheless.

After that, it's just a matter of running the game. Has to run a few optimizations
over it to look for repeated states, but it runs in a few seconds once those are in
place.

Part 2 is just running it from start to end to start and back to end again. :)

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2022/24-blizzard-basin/index.ts
```
