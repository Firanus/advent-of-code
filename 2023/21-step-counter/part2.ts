import path from "path";
import fs from "fs";

interface JourneyPoint {
  x: number;
  y: number;
  stepsTaken: number;
}

const STEPS_TO_TAKE = 26501365;

const setupEmptyGrid = (length: number): number[][] => {
  const grid: number[][] = [];
  for (let i = 0; i < length; i++) {
    grid.push([]);
    for (let j = 0; j < length; j++) {
      grid[i].push(0);
    }
  }
  return grid;
};

const getVisitedPointsOnSpecificSubGrid = (
  visitedPoints: {
    [key: string]: number;
  },
  targetGridXIndex: number,
  targetGridYIndex: number,
  gridLength: number
): number[][] => {
  const pointsOnSubGrid = setupEmptyGrid(gridLength);
  Object.keys(visitedPoints).forEach((key) => {
    const [x, y, gridXIndex, gridYIndex] = key
      .split(",")
      .map((x) => parseInt(x, 10));
    if (gridXIndex === targetGridXIndex && gridYIndex === targetGridYIndex) {
      pointsOnSubGrid[y][x] = visitedPoints[key];
    }
  });

  return pointsOnSubGrid;
};

const getStepKey = (
  point: { x: number; y: number },
  grid: string[][]
): string => {
  const { x, y } = point;
  const gridYIndex = Math.floor(point.y / grid.length);
  const gridXIndex = Math.floor(point.x / grid[0].length);
  const normalisedX =
    x % grid[0].length < 0
      ? (x % grid[0].length) + grid[0].length
      : x % grid[0].length;
  const normalisedY =
    y % grid.length < 0 ? (y % grid.length) + grid.length : y % grid.length;

  return `${normalisedX},${normalisedY},${gridXIndex},${gridYIndex}`;
};

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

    const INITIAL_STEPS_TO_TAKE = grid.length * 4;
    while (pointsToVisit.length) {
      const currentPoint = pointsToVisit.shift() as JourneyPoint;
      const { x, y, stepsTaken } = currentPoint;
      const yPosition =
        y % grid.length < 0 ? (y % grid.length) + grid.length : y % grid.length;
      const xPosition =
        x % grid[0].length < 0
          ? (x % grid[0].length) + grid[0].length
          : x % grid[0].length;

      if (grid[yPosition][xPosition] === "#") {
        continue;
      }

      if (visitedPoints[getStepKey(currentPoint, grid)]) {
        continue;
      }
      visitedPoints[getStepKey(currentPoint, grid)] = stepsTaken;

      if (stepsTaken === INITIAL_STEPS_TO_TAKE) {
        continue;
      }

      pointsToVisit.push(
        { x: x + 1, y, stepsTaken: stepsTaken + 1 },
        { x: x - 1, y, stepsTaken: stepsTaken + 1 },
        { x, y: y + 1, stepsTaken: stepsTaken + 1 },
        { x, y: y - 1, stepsTaken: stepsTaken + 1 }
      );
    }

    const gridLength = grid.length;

    // These are their own thing and need to be calculated as such
    const pointsOnCentralGrid = getVisitedPointsOnSpecificSubGrid(
      visitedPoints,
      0,
      0,
      gridLength
    );

    const correctParity = STEPS_TO_TAKE % 2;

    let resultsForCentralGrid = 0;
    for (let i = 0; i < gridLength; i++) {
      for (let j = 0; j < gridLength; j++) {
        const stepsToPoint = pointsOnCentralGrid[i][j];
        if (
          stepsToPoint === 0 &&
          !(i === startingYCoordinate && j === startingXCoordinate)
        ) {
          continue;
        }

        resultsForCentralGrid +=
          stepsToPoint <= STEPS_TO_TAKE && stepsToPoint % 2 === correctParity
            ? 1
            : 0;
      }
    }
    console.log("Points from one-off grids", resultsForCentralGrid);

    // For these grids, imagine just taking the grid and adding another
    // iteration vertically or horizontally along. Because all of these
    // calculations involve just adding the grid length, the maths is the same
    // regardless of whether we expand vertically or horizontally.
    const gridsToCountVertically = [
      getVisitedPointsOnSpecificSubGrid(visitedPoints, 1, 0, gridLength),
      getVisitedPointsOnSpecificSubGrid(visitedPoints, 0, 1, gridLength),
      getVisitedPointsOnSpecificSubGrid(visitedPoints, -1, 0, gridLength),
      getVisitedPointsOnSpecificSubGrid(visitedPoints, 0, -1, gridLength),
    ];
    const verticalPointsAdded = gridsToCountVertically.map((grid) => {
      let resultPointsOnInfiniteGrid = 0;
      for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
          const isPointBlocked = grid[i][j] === 0;
          if (isPointBlocked) {
            continue;
          }

          // This is the number of times this point will occur between now
          // and the step count.
          const numberOfIterationsToTake = Math.floor(
            (STEPS_TO_TAKE - grid[i][j]) / gridLength
          );
          const isCurrentPointCounted = grid[i][j] % 2 === correctParity;

          const iterationsIncludingCurrent = numberOfIterationsToTake + 1;

          const resultToAdd = isCurrentPointCounted
            ? Math.ceil(iterationsIncludingCurrent / 2)
            : Math.floor(iterationsIncludingCurrent / 2);

          resultPointsOnInfiniteGrid += resultToAdd;
        }
      }
      return resultPointsOnInfiniteGrid;
    });
    console.log("Vertical points added", verticalPointsAdded);

    // The difference with the diagonal grids is that you have to imagine
    // not only stacking upwards, but also horizontally and diagonally.
    // Thus, for each point in the diagonal grid, you have to count it
    // for it's triangle number set of times. However, the additional
    // note is that depending on parity, you count either the even or
    // odd iterations only.
    const gridsToCountDiagonally = [
      getVisitedPointsOnSpecificSubGrid(visitedPoints, 1, 1, gridLength),
      getVisitedPointsOnSpecificSubGrid(visitedPoints, -1, 1, gridLength),
      getVisitedPointsOnSpecificSubGrid(visitedPoints, 1, -1, gridLength),
      getVisitedPointsOnSpecificSubGrid(visitedPoints, -1, -1, gridLength),
    ];
    const diagonalPointsAdded = gridsToCountDiagonally.map((grid) => {
      let resultPointsOnInfiniteGrid = 0;
      for (let i = 0; i < gridLength; i++) {
        for (let j = 0; j < gridLength; j++) {
          const isPointBlocked = grid[i][j] === 0;
          if (isPointBlocked) {
            continue;
          }

          // This is the number of times this point will occur between now
          // and the step count.
          const numberOfIterationsToTake = Math.floor(
            (STEPS_TO_TAKE - grid[i][j]) / gridLength
          );
          const iterationsIncludingCurrent = numberOfIterationsToTake + 1;

          const isCurrentPointCounted = grid[i][j] % 2 === correctParity;

          const sumOfOddNumbersToN = (n: number) =>
            ((n + (n % 2)) / 2) * ((n + (n % 2)) / 2);
          const sumOfEvenNumbersToN = (n: number) =>
            ((n - (n % 2)) / 2) * ((n - (n % 2)) / 2) + (n - (n % 2)) / 2;

          resultPointsOnInfiniteGrid += isCurrentPointCounted
            ? sumOfOddNumbersToN(iterationsIncludingCurrent)
            : sumOfEvenNumbersToN(iterationsIncludingCurrent);
        }
      }
      return resultPointsOnInfiniteGrid;
    });

    console.log("Diagonal points added", diagonalPointsAdded);

    const result =
      resultsForCentralGrid +
      verticalPointsAdded.reduce((acc, curr) => acc + curr, 0) +
      diagonalPointsAdded.reduce((acc, curr) => acc + curr, 0);

    console.log("Part 2 Solution -", result);
  }
);
