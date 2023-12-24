# 2023 - Day 23

[https://adventofcode.com/2023/day/23](https://adventofcode.com/2023/day/23)

Goodness, this one was a lot. And the first problem I haven't solved on the day itself.
Now, to be fair, I blame this with suddenly getting a god-awful stomach bug, as I came
to a lot of the key realisations correctly, it just took me absolutely bloody forever
to do so. Like, genuinely all the time in the world. Oof.

The bigger issue though is that I forgot how to implement DFS on a queue, which was a
little shameful. Again though, this is a learning I don't think I'll ever forget. BFS,
add to end of queue, pull from front. DFS, add to end of queue, pull from end. So easy,
and yet it messed with me more than it should've. Ah well.

ANYWAY, the problem itself was interesting. We were presented with a grid, but it was
actually compressible into a muuuuuch smaller graph. Realised that, did it, struggled
with bugs for just about forever, and then got there. Solution takes about 25s to run
though.

Added some nice visualisations of the compressed graph too.

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2023/23-a-long-walk/index.ts
```
