# 2019 - Day 1

[https://adventofcode.com/2019/day/3](https://adventofcode.com/2019/day/3)

A problem about finding intersections on a 2D grid.

Note, my solution to this problem is inefficient; I'm essentially just collecting
every point the wires touch and then doing an n^2 search to find intersections. A
more efficient solution would be to

1. In addition to storing all the points in-order, also store the second wire coordinates in a hash-map
2. This would make finding the intersections O(n) rather O(n^2)
3. You would still need to iterate over both paths to then find the number of steps, but it ends up much better overall

However, I'm lazy, and my solution only took like 30s to run, so I'm happy with it. Thus, onwards we go.

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2019/03-crossed-wires/index.ts
```
