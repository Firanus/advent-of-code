# 2019 - Day 7

[https://adventofcode.com/2019/day/7](https://adventofcode.com/2019/day/7)

The third of the VM problems. Once again, I had to rewrite a few bits of my computer
to figure out the best way to handle the new requirements. In this case, blocking
execution while waiting for an input.

Ended up introducing a little bit of class-based TS to the IntCode computer. We're now
in a slightly odd place where the computer has a class-based interface for usage, but
the underlying code is largely still functional in its approach. Still, it works!

Finally, this problem also asked us to find all the permutations of a short list, which
I took as an excuse to learn about Heap's algorithm. Still don't quite understand it,
but we have an implementation.

To solve both parts, run the following from the project root:

```sh
npx ts-node 2019/05-sunny-asteroids/index.ts
```
