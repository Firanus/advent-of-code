# 2022 - Day 17

[https://adventofcode.com/2022/day/17](https://adventofcode.com/2022/day/17)

A tough problem, but after Day 16, it felt way more approachable.

Part 1 was basically building a simulation for falling rocks in the way the
problem suggests. Part 2 involved figuring out how cycles appeared in that pattern,
so you didn't have to do 1 trillion iterations (literally).

My first attempt at finding cycles was both bad and crazy inefficient. I had a peek
at some thoughts online and found some really elegant ones that I went ahead with.
Usually I really try to avoid looking at anybody else's work, but in this case (a fair
few hours in) ended up being a big net win for me. Going to do more of that in future
I think. After you've struggled through, seeing a really good solution helps make you
better. :)

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2022/17-pyroclastic-flow/index.ts
```
