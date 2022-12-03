# 2019 - Day 10

[https://adventofcode.com/2019/day/10](https://adventofcode.com/2019/day/10)

An interesting little problem around seeing what points in a grid you can see from
elsewhere on the grid. I ended up solving it by "spiraling out" from each origin point,
but a more efficient solution would be to just process the grid, using absolute distance
to the origin to decide which of two "inline" points to keep. You could also store counted
points in a dictionary keyed by angle to speed up querying there.

The trickiest part of this problem ended up being some of the maths. Turns out to
work out the angles between two points (the method I used to see if two points were
inline with each other, and thus one blocked the view of the other) its easiest to use
`atan`. The thing is though, that atan only gives values between 0 and 180 degrees, so
you can't distinguish quadrants. There's a function in the Math library called `Math.atan2`
which can. But that was confusing for awhile.

For Part 2, all we really had to do was change the axis we were calculating the angle from
and then order the targetted asteroids.

As an aside, I also did part 1 of this problem months ago, and then didn't come back to
complete part 2 til Advent of Code 2022 has started. So my delta time will be hilarious.

To solve both parts, run the following from the project root:

```sh
npx ts-node 2019/10-monitoring-station/index.ts
```
