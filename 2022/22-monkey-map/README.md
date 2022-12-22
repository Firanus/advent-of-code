# 2022 - Day 22

[https://adventofcode.com/2022/day/22](https://adventofcode.com/2022/day/22)

This one is an interesting problem! It's essentially moving on a grid with some
interesting wrapping rules. Part 1 was all good. So weird input parsing, but it
was all hunky dorry. Part 2 involves a total rewrite of the wrapping logic I
didn't see coming. Your input is actually the 6 faces of a cube laid out, and
you have to wrap from grid face to grid face.

I ended up actually cutting up a bit of paper into the shape of my input to more
easily visualise how the cube sides come together. As a result, there's some
hardcoding in here. Be interested to see what the real general solution is. :)

Given the total rewrite, I split this one into two parts.

To solve Part 1, run the following from the project root:

```sh
npx ts-node 2022/05-supply-stacks/part1/index.ts
```

To solve Part 2, run the following from the project root:

```sh
npx ts-node 2022/05-supply-stacks/part2/index.ts
```
