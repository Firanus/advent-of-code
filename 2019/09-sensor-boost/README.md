# 2019 - Day 9

[https://adventofcode.com/2019/day/9](https://adventofcode.com/2019/day/9)

VM problem, number 4. Relatively simple tweaks to the intcode computer to support a new
parameter mode: "relative mode".

This one also had a few fun extra tidbits:

1. One of the introduced programs was a quine! I.e. It outputs itself.
2. In addition, apparently this is enough to "complete" the computer. We'll see what that means in future!

To solve both parts, run the following from the project root:

```sh
npx ts-node 2019/09-sensor-boost/index.ts
```
