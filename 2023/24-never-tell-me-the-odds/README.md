# 2023 - Day 24

[https://adventofcode.com/2023/day/24](https://adventofcode.com/2023/day/24)

What a problem today was. Ultimately, the part 2 here gives you a set of linear
algebra equations you need to solve. A lot of folks (Luke Storry included) just
went to a linear algebra solver to do it for them, but I did it holistically,
which I'm happy with. I will admit that Reddit gave me a nudge in the right
direction however.

The premise of the solution is built on a few things:

1. We have numerous instances of identical x, y and z velocities in the inputs. These constrain the number of possible velocities down significantly, because if two points have the same X velocity, then the possible X velocities are have to satisfy to (DistanceDif % (rockV - hailV)) = 0 . So you can loop over all pairs of hailstones to get a really very strict set of possible velocities. (In point of fact, for my input, this left only one option! I did the rest properly, because it didn't work for the test input, but I could have skipped from there).
2. With a set of velocities, the second insight is that if you change your frame of reference to that of the rock (by subtracting your proposed rock velocity from each hailstone velocity), then all the lines will have to intersect at a single point. So calculate the intersection of two adjusted hailstones, see if you get a valid point, and then just check that every line works.
3. The position of that intersection point is where you launch the rock from. Solved!

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2023/24-never-tell-me-the-odds/index.ts
```
