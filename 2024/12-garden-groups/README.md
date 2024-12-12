# 2024 - Day 12

[https://adventofcode.com/2024/day/12](https://adventofcode.com/2024/day/12)

Today's problem was about finding regions in a graph, and I'm ashamed to say
that I used Cursor to help me out, and it was ludicruously helpful, particularly
in part 1, where with a bit of simple guidance, it wrote a flood fill algorithm
for me to find the regions, and a transparently correct way to find the perimeter.

Part 2 was harder, because finding numbers of sides was trickier, and the LLM couldn't
do it on its own. However, some tremendously useful advice (namely, the number of sides
equals the number of corners) from the subreddit helped me out, and I was able to code it.

Overall, the LLM gives me mixed feelings. Something to think about here.

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2024/12-garden-groups
```
