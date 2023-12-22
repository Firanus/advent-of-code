import path from "path";
import fs from "fs";

interface Brick {
  id: number;
  xStart: number;
  yStart: number;
  zStart: number;
  xEnd: number;
  yEnd: number;
  zEnd: number;
}

const generateEmptyBricksArray = (bricks: Brick[]): number[][][] => {
  let xMax = bricks.reduce((acc, curr) => Math.max(acc, curr.xEnd), 0);
  let yMax = bricks.reduce((acc, curr) => Math.max(acc, curr.yEnd), 0);
  let zMax = bricks.reduce((acc, curr) => Math.max(acc, curr.zEnd), 0);

  let bricksArray: number[][][] = [];
  for (let i = 0; i <= zMax; i++) {
    bricksArray.push([]);
    for (let j = 0; j <= yMax; j++) {
      bricksArray[i].push([]);
      for (let k = 0; k <= xMax; k++) {
        bricksArray[i][j].push(0);
      }
    }
  }

  return bricksArray;
};

const copyBricksArrayExcludingBrick = (
  bricksArray: number[][][],
  excludingBrick: number
) => {
  const newBricksArray = bricksArray.map((xySlab) =>
    xySlab.map((row) => row.map((val) => (val === excludingBrick ? 0 : val)))
  );

  return newBricksArray;
};

const populateBricksArray = (bricks: Brick[], bricksArray: number[][][]) => {
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    for (let z = brick.zStart; z <= brick.zEnd; z++) {
      for (let y = brick.yStart; y <= brick.yEnd; y++) {
        for (let x = brick.xStart; x <= brick.xEnd; x++) {
          bricksArray[z][y][x] = brick.id;
        }
      }
    }
  }
};

const descendBricks = (
  bricksArray: number[][][],
  bricksMap: { [key: number]: Brick }
) => {
  const bricksToDescendIds = Object.values(bricksMap)
    .sort((a, b) => a.zStart - b.zStart)
    .map((brick) => brick.id);

  const newBricksMap: { [key: number]: Brick } = {};

  bricksToDescendIds.forEach((brickId) => {
    const originalBrick = bricksMap[brickId];
    const brick = { ...originalBrick };

    let canDescend = true;
    while (canDescend) {
      if (brick.zStart === 0) {
        canDescend = false;
      } else {
        for (let y = brick.yStart; y <= brick.yEnd; y++) {
          for (let x = brick.xStart; x <= brick.xEnd; x++) {
            if (bricksArray[brick.zStart - 1][y][x] !== 0) {
              canDescend = false;
              break;
            }
          }
        }
      }

      if (canDescend) {
        for (let z = brick.zStart; z <= brick.zEnd; z++) {
          for (let y = brick.yStart; y <= brick.yEnd; y++) {
            for (let x = brick.xStart; x <= brick.xEnd; x++) {
              bricksArray[z - 1][y][x] = brick.id;
              bricksArray[z][y][x] = 0;
            }
          }
        }

        brick.zStart -= 1;
        brick.zEnd -= 1;
      }
    }

    newBricksMap[brickId] = brick;
  });

  return newBricksMap;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const bricks = data.split("\n").map((row, index) => {
      const [brickStart, brickEnd] = row.split("~");
      const [xStart, yStart, zStart] = brickStart
        .split(",")
        .map((x) => parseInt(x, 10));
      const [xEnd, yEnd, zEnd] = brickEnd
        .split(",")
        .map((x) => parseInt(x, 10));

      return { xStart, yStart, zStart, xEnd, yEnd, zEnd, id: index + 1 };
    });

    const bricksArray = generateEmptyBricksArray(bricks);

    populateBricksArray(bricks, bricksArray);

    const initialBricksMap: { [key: number]: Brick } = bricks.reduce(
      (acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      },
      {} as { [key: number]: Brick }
    );

    const descendedBricksMap = descendBricks(bricksArray, initialBricksMap);

    const movedBrickCounts: number[] = [];
    for (let i = 0; i < bricks.length; i++) {
      const alteredBricksArray = copyBricksArrayExcludingBrick(
        bricksArray,
        i + 1
      );
      const alteredBricksMap: { [key: number]: Brick } = JSON.parse(
        JSON.stringify(descendedBricksMap)
      );
      delete alteredBricksMap[i + 1];

      const finalBricksMap = descendBricks(
        alteredBricksArray,
        alteredBricksMap
      );

      const differenceCount = Object.keys(finalBricksMap).reduce(
        (acc, curr) => {
          const key = parseInt(curr, 10);
          const original = alteredBricksMap[key];
          const final = finalBricksMap[key];
          if (
            original.xStart !== original.xStart ||
            original.yStart !== final.yStart ||
            original.zStart !== final.zStart ||
            original.xEnd !== final.xEnd ||
            original.yEnd !== final.yEnd ||
            original.zEnd !== final.zEnd
          ) {
            return acc + 1;
          }
          return acc;
        },
        0
      );
      movedBrickCounts.push(differenceCount);
    }

    const part1Result = movedBrickCounts.filter((x) => x === 0).length;
    const part2Result = movedBrickCounts.reduce((acc, curr) => acc + curr, 0);

    console.log("Part 1 Solution -", part1Result);
    console.log("Part 2 Solution -", part2Result);
  }
);
