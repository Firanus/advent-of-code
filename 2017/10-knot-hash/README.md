# 2017 - Day 10

[https://adventofcode.com/2017/day/10](https://adventofcode.com/2017/day/10)

Bit of a weird problem this. I broke this one into 2 files because the two parts
ask you to treat the input in fundamentally different ways.

## Part 1

In Part 1, the logic with the array at the beginning looked like it was pushing
for a linked list, but I found it easiest to just rotate around the array,
because the concept of the array's "start" was important to the answer.

To solve Part 1, run the following from the project root:

```sh
node 2017/10-knot-hash/part1/index.js
```

## Part 2

Part 2 just involved doing a lot of more CS-ey things to the problem. `XOR` ops,
`charCodeAt`, and the like. Still, nothing actually too conceptually difficult
there, just important to carefully parse the problem and execute accordingly.

EDIT: It turns out day 14 needs the code we wrote for Part 2. Thus, I have now
refactored part 2 to use the shared `createKnotHash` code that's been moved into
a shared file.

```sh
node 2017/10-knot-hash/part2/index.js
```
