# 2022 - Day 20

[https://adventofcode.com/2022/day/20](https://adventofcode.com/2022/day/20)

Pretty easy one today. I was initially a little terrified that part 2 would
involve having to find some kind of cycle in the mixing, which seemed impossible.
Luckily, it absolutely did not involve that! The optimisations I put in by default
to avoid unnecessary movement did the work for Part 2 by themselves.

Just for fun, I did this one with LinkedLists as well. (I forgot `array.splice` is
a thing in JS. Oops! That would be way faster, not that this is that slow).

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2022/20-grove-positioning-system/index.ts
```
