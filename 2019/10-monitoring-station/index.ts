import path from "path";
import fs from "fs";

interface Point {
  x: number;
  y: number;
}

type PointWithAngleToCentralAsteroid = Point & {
  angleToCentralAsteroid: number;
};

const calculateAngleBetweenOriginAndPoint = (origin: Point, point: Point) => {
  const angleInDegreesFromNegativeXAxisClockwise =
    (Math.atan2(point.y - origin.y, point.x - origin.x) * 180) / Math.PI + 180;

  // For part 2, we need 0 degrees to be the y-axis, so we have to reorder our angles
  if (angleInDegreesFromNegativeXAxisClockwise < 90) {
    return 360 - (90 - angleInDegreesFromNegativeXAxisClockwise);
  }
  return angleInDegreesFromNegativeXAxisClockwise - 90;
};

const outsideGrid = ({
  point,
  maxX,
  maxY,
}: {
  point: Point;
  maxY: number;
  maxX: number;
}) => point.x < 0 || point.x > maxX || point.y < 0 || point.y > maxY;

const onEdge = ({
  point,
  minX,
  maxX,
  minY,
  maxY,
}: {
  point: Point;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}) =>
  point.x === minX || point.y === minY || point.x === maxX || point.y === maxY;

// Find highest value in 2D grid, output value and coordinates
const findBestSpot = (distanceGrid: number[][]) => {
  const value = distanceGrid.reduce(
    (acc, currRow, yIndex) => {
      const rowMax = currRow.reduce(
        (rowAcc, curr, xIndex) =>
          curr > rowAcc.val ? { val: curr, xCoord: xIndex } : rowAcc,
        { xCoord: -1, val: -1 }
      );
      return rowMax.val > acc.val
        ? { val: rowMax.val, xCoord: rowMax.xCoord, yCoord: yIndex }
        : acc;
    },
    { val: -1, xCoord: -1, yCoord: -1 }
  );
  return value;
};

const containsCoordinateInLine = (
  countedAsteroids: Point[],
  origin: Point,
  newPoint: Point
) => {
  const angleToPoint = calculateAngleBetweenOriginAndPoint(origin, newPoint);
  const inlineWithExistingPoint = countedAsteroids.reduce((acc, curr) => {
    const angleToCountedPoint = calculateAngleBetweenOriginAndPoint(
      origin,
      curr
    );
    return acc || angleToPoint === angleToCountedPoint;
  }, false);
  return inlineWithExistingPoint;
};

const encodeCoordinate = ({ x, y }: Point) => `${x}-${y}`;
const decodeCoordinate = (encodedCoordinate: string): Point => ({
  x: encodedCoordinate.split("-").map((x) => parseInt(x, 10))[0],
  y: encodedCoordinate.split("-").map((x) => parseInt(x, 10))[1],
});

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const asteroidGrid = data
    .split("\n")
    .map((x) => x.split("").map((x) => x === "#"));

  const visitedAsteroidsPerPoint: {
    [encodedPoint: string]: PointWithAngleToCentralAsteroid[];
  } = {};
  const distanceGrid = asteroidGrid.map((row, yCoord) =>
    row.map((containsAsteroid, xCoord) => {
      if (!containsAsteroid) {
        return 0;
      }
      const countedAsteroids: PointWithAngleToCentralAsteroid[] = [];

      const greatestDistanceFromPoint = Math.max(
        xCoord,
        yCoord,
        row.length - xCoord,
        asteroidGrid.length - yCoord
      );

      // We essentially calculate the numbers by starting at each point and then
      // spiralling out.
      for (let i = 1; i <= greatestDistanceFromPoint; i++) {
        for (let j = yCoord - i; j <= yCoord + i; j++) {
          for (let k = xCoord - i; k <= xCoord + i; k++) {
            if (
              // Ensures we don't leave the grid
              outsideGrid({
                point: { x: k, y: j },
                maxY: asteroidGrid.length - 1,
                maxX: row.length - 1,
              }) ||
              // Ensures we don't recalculate for points inside the "box" we're currently
              // looking at.
              !onEdge({
                point: { x: k, y: j },
                minX: xCoord - i,
                maxX: xCoord + i,
                minY: yCoord - i,
                maxY: yCoord + i,
              })
            ) {
              continue;
            }

            if (
              asteroidGrid[j][k] &&
              !countedAsteroids.find((val) => val.x === k && val.y === j) &&
              !containsCoordinateInLine(
                countedAsteroids,
                { x: xCoord, y: yCoord },
                { x: k, y: j }
              )
            ) {
              countedAsteroids.push({
                x: k,
                y: j,
                angleToCentralAsteroid: calculateAngleBetweenOriginAndPoint(
                  { x: xCoord, y: yCoord },
                  { x: k, y: j }
                ),
              });
            }
          }
        }
      }
      visitedAsteroidsPerPoint[encodeCoordinate({ x: xCoord, y: yCoord })] =
        countedAsteroids;
      return countedAsteroids.length;
    })
  );

  displayGrid(distanceGrid);
  const bestSpot = findBestSpot(distanceGrid);
  console.log(
    `Best spot is (${bestSpot.xCoord},${bestSpot.yCoord}) which can see ${bestSpot.val} asteroids`
  );

  // Part 2 implies that it's possible to visit additional asteroids beyond those visited in the
  // first pass, as vaporising an asteroid might reveal one behind it. However, it asks about the
  // 200th vaporised asteroid, and my best point sees more than 200 asteroids, so we can just
  // ignore that. Lucky I guess.
  const vaporisedAsteroidsInOrder = visitedAsteroidsPerPoint[
    encodeCoordinate({ x: bestSpot.xCoord, y: bestSpot.yCoord })
  ].sort((a, b) => a.angleToCentralAsteroid - b.angleToCentralAsteroid);

  const twoHundrethVaporisedAsteroid = vaporisedAsteroidsInOrder[199];
  console.log(
    `200th vaporised asteroid is (${twoHundrethVaporisedAsteroid.x},${twoHundrethVaporisedAsteroid.y})`
  );
  console.log("");

  console.log(`Part 1 Answer: ${bestSpot.val}`);
  console.log(
    `Part 2 Answer: ${
      twoHundrethVaporisedAsteroid.x * 100 + twoHundrethVaporisedAsteroid.y
    }`
  );
});

// ----------------------------------------------------------------------------
// DEBUG METHODS
// ----------------------------------------------------------------------------
const displayGrid = (distanceGrid: number[][]) => {
  const bestSpot = findBestSpot(distanceGrid);
  const sizeOfBest = bestSpot.val.toString().length;
  console.log(
    distanceGrid
      .map((row) =>
        row
          .map((val) =>
            (val === 0 ? "." : val.toString()).padStart(sizeOfBest + 1)
          )
          .join("")
      )
      .join("\n")
  );
};

const displayGridWithHighlightedPoint = ({
  asteroidGrid,
  countedAsteroids,
  point,
}: {
  asteroidGrid: boolean[][];
  countedAsteroids: Point[];
  point: Point;
}) => {
  const gridToDisplay = asteroidGrid.map((row, yCoord) =>
    row.map((hasAsteroid, xCoord) => {
      if (!hasAsteroid) {
        return ".";
      }
      if (xCoord === point.x && yCoord === point.y) {
        return "P";
      }

      if (
        countedAsteroids.find((val) => val.x === xCoord && val.y === yCoord)
      ) {
        return "H";
      }

      return "*";
    })
  );

  console.log(gridToDisplay.map((row) => row.join(" ")).join("\n"));
};
