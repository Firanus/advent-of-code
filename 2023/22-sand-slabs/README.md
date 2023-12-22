# 2023 - Day 22

[https://adventofcode.com/2023/day/22](https://adventofcode.com/2023/day/22)

Today was a classic case of me being hoisted on my own petard for trying to be too clever.

For Part 2, I looked at the problem and thought that a recursive solution might work. I took an algorithm I'd written to see what moves when I remove an entry and tried recursing it up the grid. Spent some time coding that up, ran it, it worked for the test input, and was miles off the correct answer for the proper input.

Then realised I was being a dweeb and I could just take the descending code I'd already written, remove a brick by hand, and just run it again and compare. This definitely feels like the "brute forcey" solution, and it takes about 2 seconds to run, but it's way simpler. Recursion is amazing until you have to debug it.

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2023/22-sand-slabs/index.ts
```
