# 2024 - Day 9

[https://adventofcode.com/2024/day/9](https://adventofcode.com/2024/day/9)

Really interesting little problem about simulating a disk defrangmenting
process. Honestly involved a little bit of thinking to figure out how to
structure this right. Settled for processing an array from both ends. That
worked, but it made part 2 really susceptible to little niggles, so I had
some debugging to do.

Because the premise was two different strategies here, and I was manipulating
my input, I split out Part 1 and Part 2 today.

To solve Part 1, run the following from the project root:

```sh
npx ts-node 2024/09-disk-fragmenter/part1.ts
```

To solve Part 2, run the following from the project root:

```sh
npx ts-node 2024/09-disk-fragmenter/part2.ts
```
