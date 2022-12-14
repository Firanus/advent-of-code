import path from "path";
import fs from "fs";
import { Console } from "console";

type Point = { x: number; y: number };
type GridPoint = "." | "o" | "#";

const isFull = (gridPoint: GridPoint): boolean =>
  gridPoint === "o" || gridPoint === "#";

const visualiseGrid = (grid: GridPoint[][]) => {
  console.log(grid.map((x) => x.join("")).join("\n"));
};

const normaliseCoordinate = (point: Point, minX: number): Point => ({
  x: point.x - minX,
  y: point.y,
});

fs.readFile(
  path.resolve(__dirname, "../input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const linesToDraw: Point[][] = data.split("\n").map((rawLine) =>
      rawLine.split(" -> ").map((rawPoint) => {
        const [x, y] = rawPoint.split(",");
        return { x: parseInt(x, 10), y: parseInt(y, 10) };
      })
    );

    const maxYCoord = linesToDraw
      .flat()
      .map((point) => point.y)
      .reduce((acc, curr) => Math.max(acc, curr), Number.NEGATIVE_INFINITY);
    const Y_SIZE = maxYCoord + 3;

    const maxXCoord = 501 + Y_SIZE;
    const minXCoord = 499 - Y_SIZE;

    const X_SIZE = maxXCoord - minXCoord + 1;

    const grid: GridPoint[][] = [];
    for (let i = 0; i < Y_SIZE; i++) {
      grid.push([]);
      for (let j = 0; j < X_SIZE; j++) {
        grid[i].push(i === Y_SIZE - 1 ? "#" : ".");
      }
    }

    // Draw Lines
    for (let i = 0; i < linesToDraw.length; i++) {
      const linePoints = linesToDraw[i];
      for (let j = 1; j < linePoints.length; j++) {
        const startPoint = normaliseCoordinate(linePoints[j - 1], minXCoord);
        const endPoint = normaliseCoordinate(linePoints[j], minXCoord);

        if (startPoint.x === endPoint.x) {
          for (
            let y = Math.min(startPoint.y, endPoint.y);
            y <= Math.max(startPoint.y, endPoint.y);
            y++
          ) {
            grid[y][startPoint.x] = "#";
          }
        } else {
          for (
            let x = Math.min(startPoint.x, endPoint.x);
            x <= Math.max(startPoint.x, endPoint.x);
            x++
          ) {
            grid[startPoint.y][x] = "#";
          }
        }
      }
    }

    // visualiseGrid(grid);

    let shouldAddSandGrain = true;
    while (shouldAddSandGrain) {
      let currentSandGrainCoordinate: Point = { x: 500, y: 0 };
      let isCurrentGrainAtRest = false;
      while (!isCurrentGrainAtRest) {
        const gridCoordinate = normaliseCoordinate(
          currentSandGrainCoordinate,
          minXCoord
        );
        if (!isFull(grid[gridCoordinate.y + 1][gridCoordinate.x])) {
          currentSandGrainCoordinate = {
            x: currentSandGrainCoordinate.x,
            y: currentSandGrainCoordinate.y + 1,
          };
        } else if (!isFull(grid[gridCoordinate.y + 1][gridCoordinate.x - 1])) {
          currentSandGrainCoordinate = {
            x: currentSandGrainCoordinate.x - 1,
            y: currentSandGrainCoordinate.y + 1,
          };
        } else if (!isFull(grid[gridCoordinate.y + 1][gridCoordinate.x + 1])) {
          currentSandGrainCoordinate = {
            x: currentSandGrainCoordinate.x + 1,
            y: currentSandGrainCoordinate.y + 1,
          };
        } else {
          isCurrentGrainAtRest = true;
        }
      }

      if (isCurrentGrainAtRest) {
        const sandCoordinate = normaliseCoordinate(
          currentSandGrainCoordinate,
          minXCoord
        );
        grid[sandCoordinate.y][sandCoordinate.x] = "o";
      }

      if (
        currentSandGrainCoordinate.x === 500 &&
        currentSandGrainCoordinate.y === 0
      ) {
        shouldAddSandGrain = false;
        break;
      }
    }

    // visualiseGrid(grid);
    const numberOfSandPoints = grid.reduce(
      (acc, row) =>
        acc + row.reduce((rowAcc, curr) => rowAcc + (curr === "o" ? 1 : 0), 0),
      0
    );

    console.log("Part 2 Solution:", numberOfSandPoints);
  }
);
