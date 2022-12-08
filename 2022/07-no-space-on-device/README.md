# 2022 - Day 7

[https://adventofcode.com/2022/day/7](https://adventofcode.com/2022/day/7)

An interesting problem, where you're essentially being asked to recreate a
filesystem by looking through the logs of someone using `cd` and `ls` to
nevigate around it.

I went about this pretty naïvely, taking the logs, rebuilding the tree, and
then working on the tree to find what I needed using recursion.

However, there was another way, where you utilise the fact that your input is
itself already a traversal to skip some work. Instead, just store the directories
as key-value pairs with sizes and use that to calculate what you need. Less work
practically, though it'll make some of the size calculations a trifle more complex

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2022/07-no-space-on-device/index.ts
```
