import path from "path";
import fs from "fs";

const showXProjection = (bricksArray: number[][][]) => {
  const xProjection = bricksArray
    .map((xySlab, z) => {
      const arrayColumn = (arr: any[][], n: number) => arr.map((x) => x[n]);
      const columns: number[][] = [];
      for (let i = 0; i < xySlab.length; i++) {
        columns.push(arrayColumn(xySlab, i));
      }
      return columns
        .map((col) => (col.some((val) => val > 0) ? "#" : "."))
        .join("");
    })
    .reverse()
    .join("\n");

  console.log(xProjection);
};

const showYProjection = (bricksArray: number[][][]) => {
  const yProjection = bricksArray
    .map((xySlab) =>
      xySlab.map((row) => (row.some((val) => val > 0) ? "#" : ".")).join("")
    )
    .reverse()
    .join("\n");

  console.log(yProjection);
};

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
    const brick = bricksMap[brickId];

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

    newBricksMap[brickId] = { ...brick };
  });

  return newBricksMap;
};

const getBricksThatWouldFall = (
  index: number,
  bricksArray: number[][][],
  bricksMap: { [key: number]: Brick },
  excludingBricks: number[] = []
): number[] => {
  const brick = bricksMap[index];

  const bricksAboveBrick: Set<number> = new Set();
  if (brick.zEnd !== bricksArray.length - 1) {
    for (let z = brick.zStart; z <= brick.zEnd; z++) {
      for (let y = brick.yStart; y <= brick.yEnd; y++) {
        for (let x = brick.xStart; x <= brick.xEnd; x++) {
          if (
            bricksArray[z + 1][y][x] !== 0 &&
            bricksArray[z + 1][y][x] !== index
          ) {
            bricksAboveBrick.add(bricksArray[z + 1][y][x]);
          }
        }
      }
    }
  }

  if (!bricksAboveBrick.size) return [];

  let bricksThatWouldFall: number[] = [];
  bricksAboveBrick.forEach((brickAbove) => {
    let supportedByOtherBrick = false;
    let upBrick = bricksMap[brickAbove];
    outer: for (let z = upBrick.zStart; z <= upBrick.zEnd; z++) {
      for (let y = upBrick.yStart; y <= upBrick.yEnd; y++) {
        for (let x = upBrick.xStart; x <= upBrick.xEnd; x++) {
          if (
            bricksArray[z - 1][y][x] !== 0 &&
            bricksArray[z - 1][y][x] !== upBrick.id &&
            bricksArray[z - 1][y][x] !== brick.id &&
            !excludingBricks.includes(bricksArray[z - 1][y][x])
          ) {
            supportedByOtherBrick = true;
            break outer;
          }
        }
      }
    }

    if (!supportedByOtherBrick) {
      bricksThatWouldFall.push(brickAbove);
    }
  });

  const finalBricksThatWouldFall = new Set<number>(bricksThatWouldFall);
  bricksThatWouldFall.forEach((brickId) => {
    const bricksThatWouldFallFromBrick = getBricksThatWouldFall(
      brickId,
      bricksArray,
      bricksMap,
      [...new Set<number>([...excludingBricks, ...bricksThatWouldFall])]
    );
    bricksThatWouldFallFromBrick.forEach((brickId) =>
      finalBricksThatWouldFall.add(brickId)
    );
  });

  return [...finalBricksThatWouldFall];
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

    const newBricksMap = descendBricks(bricksArray, initialBricksMap);

    const bricksThatWouldFallMap = Object.values(newBricksMap)
      .sort((a, b) => b.zStart - a.zStart)
      .map((brick) => brick.id)
      .reduce((acc, id) => {
        acc[id] = getBricksThatWouldFall(id, bricksArray, newBricksMap);
        return acc;
      }, {} as { [key: number]: number[] });

    const safelyDisintegratableBrickCount = Object.values(
      bricksThatWouldFallMap
    ).filter((arr) => arr.length === 0).length;

    const disintegratableBrickSum = Object.values(
      bricksThatWouldFallMap
    ).reduce((acc, curr) => acc + curr.length, 0);

    console.log(
      "NOTE: This produces an incorrect result, by about a factor of 2, for Part 2.\n"
    );
    console.log("Part 1 Solution -", safelyDisintegratableBrickCount);
    console.log("Part 2 Solution -", disintegratableBrickSum);
  }
);
