# 2022 - Day 15

[https://adventofcode.com/2022/day/15](https://adventofcode.com/2022/day/15)

First of the problems that really requires you to start thinking seriously about
coming up with an optimal solution. This one is ultimately about creating overlapping
ranges of solutions to find, first, all covered parts in a row, and then the only
_uncovered_ point in a slighly narrower grid space.

My solution isn't crazy optimal here, and takes about:

- ~ 8s for Part 1
- ~ 12s for Part 2

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2022/15-beacon-exclusion-zone/index.ts
```
