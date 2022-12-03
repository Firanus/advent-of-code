# 2017 - Day 14

[https://adventofcode.com/2017/day/14](https://adventofcode.com/2017/day/14)

Bit of an odd problem for Advent of Code this, as it involves reusing code from a
previous day, day 10. You have to use the knot hash code to create your grid.

Part 2 involves traversing a grid and looking for regions. I've done it quite
cleverly I think, in combining regions as I go, but the code is a little fragile
because of the cases you have to consider. Using typings and sets would simplify
the logic a bit.

To solve both parts, run the following from the project root:

```sh
node 2017/14-disk-defragmentation
```
