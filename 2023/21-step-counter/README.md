# 2023 - Day 21

[https://adventofcode.com/2023/day/21](https://adventofcode.com/2023/day/21)

Goodness, today was a lot. Part 2 came from nowhere to really mess with things. I also lost like an hour today because my testInput results weren't working, but it turns out the main input was. Goddamnit. :P

So, digging in. Part 1 was nothing too exciting. I started with naive BFS, but that was too slow (obviously, I forgot how exponentials work. :joy: ). The fix was obvious though; this "all steps reached" means this is essentially a chessboard, so you can just calculate all visited states, and then check whether the walk there is of parity 2. Easy.

Part 2 was a proper pain in the ass. After A LOT of trial and error, I realised that if I iterated out a grid or two, the distance between the same points on neighbouring grids always stabilised to being exactly one grid length apart from each other. I was expecting it to stabilise, that's why I went looking in the first place, but it took me a minute to figure out why it would always be a grid length. In short, it's because the outer row and column of the inputs is totally empty. Thus, to get to any particular grid, you can
just walk up the outsides and then expand in. I now _heavily_ suspect there's a cleaner way to the answer that takes advantage of that,
but I'm just glad I got there.

Anyway, once I'd found the stabilisation, it became clear how to count the results. I just needed to get the example grids post-stabilisation, and then count upwards to see how many times a given point would appear.

I treated grids vertically inline with origin and diagonal to it separately for that purpose:

- For vertical, essentially count all iterations of the point, divide by two, and add one if the current point is of the right parity.
- For diagonal, you have to count either the sum of the odd or even numbers to the number of vertical iterations. Which again depends on the parity of the point in your example grid.
- Oh, and treat the central grid as a one-off, because it is.

Sum them all up and lo and behold, you get your answer.

Oh, finally, the reason my testInput wasn't working is that it's so small it takes longer for the grids to stabilise. The solution here
is probably to just go out another layer. But I cannot be bothered to code that up right now.

To solve Part 1, run the following from the project root:

```sh
npx ts-node 2022/21-step-counter/part1.ts
```

To solve Part 2, run the following from the project root:

```sh
npx ts-node 2022/21-step-counter/part2.ts
```
