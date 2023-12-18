# 2023 - Day 17

[https://adventofcode.com/2023/day/17](https://adventofcode.com/2023/day/17)

Today was a real education in the nuances of pathfinding algorithms. Honestly,
the problem wasn't that bad. Find a path on a grid while dealing with some pretty
weird rules. However, the nuance of how best to go after that was wild. I tried
a lot of things, including 3 different A\* heuristics, a whole heap of weird
pruning mechanics and more. Ultimately, the right answer was one of the simplest
with a careful eye towards both what to optimise for (bottom up by "heat loss"
was best because it found the answer immediately when it got there), speed of
individual loop execution and tightest possible seen states setup.

Hard work for me, but very good for my learning!

Note, I actually want to come and tidy this one; there's more to learn here.

To solve part 1, run the following from the project root:

```sh
npx ts-node 2023/17-clumsy-crucible/index.ts
```

To solve part 2, run the following from the project root:

```sh
npx ts-node 2023/17-clumsy-crucible/part2.ts
```
