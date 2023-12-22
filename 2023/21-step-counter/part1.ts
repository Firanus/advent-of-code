import path from "path";
import fs from "fs";

interface JourneyPoint {
  x: number;
  y: number;
  stepsTaken: number;
}

const STEPS_TO_TAKE = 64;

const getStepKey = (point: JourneyPoint): string => `${point.x},${point.y}`;

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const grid = data.split("\n").map((row) => row.split(""));
    const startingYCoordinate = grid.findIndex((row) => row.includes("S"));
    const startingXCoordinate = grid[startingYCoordinate].findIndex(
      (char) => char === "S"
    );

    let pointsToVisit: JourneyPoint[] = [
      {
        x: startingXCoordinate,
        y: startingYCoordinate,
        stepsTaken: 0,
      },
    ];
    let visitedPoints: { [key: string]: number } = {};

    while (pointsToVisit.length) {
      const currentPoint = pointsToVisit.shift() as JourneyPoint;
      const { x, y, stepsTaken } = currentPoint;

      if (grid[y][x] === "#") {
        continue;
      }

      if (visitedPoints[getStepKey(currentPoint)]) {
        continue;
      }
      visitedPoints[getStepKey(currentPoint)] = stepsTaken;

      if (stepsTaken === STEPS_TO_TAKE) {
        continue;
      }

      pointsToVisit.push(
        { x: x + 1, y, stepsTaken: stepsTaken + 1 },
        { x: x - 1, y, stepsTaken: stepsTaken + 1 },
        { x, y: y + 1, stepsTaken: stepsTaken + 1 },
        { x, y: y - 1, stepsTaken: stepsTaken + 1 }
      );
    }

    const pointsWithCorrectParity = Object.values(visitedPoints).reduce(
      (acc, curr) => (curr % 2 === STEPS_TO_TAKE % 2 ? acc + 1 : acc),
      0
    );

    console.log("Part 1 Solution -", pointsWithCorrectParity);
  }
);
