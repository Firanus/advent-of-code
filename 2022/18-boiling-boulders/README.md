# 2022 - Day 18

[https://adventofcode.com/2022/day/18](https://adventofcode.com/2022/day/18)

This problem was frustrating, because it was actually pretty approachable,
but it took me an obscene amount of time because of a hard-to-spot typo in
my array accessing code, that was harder to spot because it only manifested
in my main input, because the test input was symmetrical.

Part 1 was pretty simple, just calculating the surface area of a 3d shape.

Part 2 was about only finding the _external_ surface area, i.e. ignoring
any air pockets caught in the shape's center. After a few false starts,
I eventually implemented a BFS around the shape to find all the spots that
air could reach, and then calculated surface area only for cube faces that
touched an air molecule. This was the right approach, and after a ton of
bug bashing, got me there.

The lesson - write a function to access objects in complex structures, like
e.g. 2D and 3D grids.

To solve both parts 1 and 2, run the following from the project root:

```sh
npx ts-node 2022/18-boiling-boulders/index.ts
```
