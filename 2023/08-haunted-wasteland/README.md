# 2023 - Day 8

[https://adventofcode.com/2023/day/8](https://adventofcode.com/2023/day/8)

Interesting one today. First "problem where you walk along a path", but
not pathfinding because you're told the route you have to walk.

The weird bit is at the end, where you walk a few paths in parallel and
have to figure out when they all end. The obvious move here is to find the
LCM of all the paths, as multiplying them all together gives you way too
big a number

Did that, but my first draft is lazy. I hardcoded in the shared factor and
went from there. We'll see if I go back and implement something cleverer.

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2023/08-haunted-wasteland/index.ts
```
