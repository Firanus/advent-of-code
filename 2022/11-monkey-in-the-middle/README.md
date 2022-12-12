# 2022 - Day 11

[https://adventofcode.com/2022/day/11](https://adventofcode.com/2022/day/11)

An odd little problem. Part 1 is all about doing a reasonably complicated bit
of parsing on the input, and then setting up an odd little logic flow to examine
how monkeys pass objects to each other.

Part 2 is a total swing, which asks you to keep the item sizes down while respecting
the mathematical relationships that drive how they're passed around.

Broke it into two parts, because the rules for keeping the sizes down are nested deep
in the code, and I couldn't be bothered to do a full-on refactor to inject the logic.

To solve Part 1, run the following from the project root:

```sh
npx ts-node 2022/11-monkey-in-the-middle/part1/index.ts
```

To solve Part 2, run the following from the project root:

```sh
npx ts-node 2022/11-monkey-in-the-middle/part2/index.ts
```
