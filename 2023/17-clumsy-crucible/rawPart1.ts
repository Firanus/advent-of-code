import path from "path";
import fs from "fs";

const getGridPointKey = (point: {
  x: number;
  y: number;
  lastDirection: Direction;
  consecutiveStraightLines: number;
}): string =>
  `${point.x},${point.y}-${point.lastDirection}-${point.consecutiveStraightLines}`;

type Direction = "up" | "down" | "left" | "right";

interface JourneyPoint {
  x: number;
  y: number;
  consecutiveStraightLines: number;
  currentHeatLoss: number;
  lastDirection: Direction;
  travelledPath: string;
}

const msToTime = (duration: number) => {
  const seconds = Math.floor(duration / 1000) % 60;
  const minutes = Math.floor(duration / 60 / 1000) % 60;
  const hours = Math.floor(duration / 60 / 60 / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${(
    duration % 1000
  )
    .toString()
    .padStart(3, "0")}`;
};

const printPathToGrid = (grid: number[][], path: string) => {
  const gridCopy = grid.map((row) => row.map((x) => x.toString()));

  path.split(";").forEach((point) => {
    const [coordinates] = point.split("-");
    const [x, y] = coordinates.split(",").map((x) => parseInt(x, 10));
    gridCopy[y][x] = "*";
  });

  console.log(gridCopy.map((row) => row.join(" ")).join("\n"), "\n");
};

const expectedValueToEnd = (point: JourneyPoint, averagedGrid: number[][]) => {
  const averageExpectedValue = averagedGrid[point.y][point.x];
  const distanceToEnd =
    averagedGrid[0].length - point.x - 1 + averagedGrid.length - point.y - 1;

  return point.currentHeatLoss + averageExpectedValue * distanceToEnd;
};

const minimumValueToEnd = (
  point: JourneyPoint,
  minimumTotalDistancesGrid: number[][]
) => {
  const minDistance = minimumTotalDistancesGrid[point.y][point.x];

  return point.currentHeatLoss + minDistance;
};

const distanceToEnd = (point: { x: number; y: number }, grid: number[][]) =>
  grid[0].length - point.x - 1 + grid.length - point.y - 1;

const getNextPoint = ({
  grid,
  currentPoint,
  y,
  x,
  direction,
}: {
  currentPoint: JourneyPoint;
  grid: number[][];
  x: number;
  y: number;
  direction: Direction;
}): JourneyPoint | undefined => {
  const { consecutiveStraightLines, currentHeatLoss, lastDirection } =
    currentPoint;
  const nextPoint = grid[y][x];
  const nextHeatLossScore = currentHeatLoss + nextPoint;

  const proposedPoint: JourneyPoint = {
    x,
    y,
    consecutiveStraightLines:
      lastDirection === direction ? consecutiveStraightLines + 1 : 1,
    currentHeatLoss: nextHeatLossScore,
    lastDirection: direction,
    travelledPath: `${
      currentPoint.travelledPath ? currentPoint.travelledPath + ";" : ""
    }${getGridPointKey(currentPoint)}`,
  };

  return proposedPoint;
};

const getAverageValueOfGridToEnd = (x: number, y: number, grid: number[][]) => {
  let total = 0;
  let count = 0;

  for (let i = y; i < grid.length; i++) {
    for (let j = x; j < grid[0].length; j++) {
      if (i === y && j === x) continue;
      total += grid[i][j];
      count++;
    }
  }

  return total / count;
};

const getMinimumValueOfGridToEnd = (x: number, y: number, grid: number[][]) => {
  const smallestRowValues = new Array(grid.length).fill(
    Number.MAX_SAFE_INTEGER
  );
  const smallestColumnValues = new Array(grid[0].length).fill(
    Number.MAX_SAFE_INTEGER
  );

  for (let i = y; i < grid.length; i++) {
    for (let j = x; j < grid[0].length; j++) {
      if (i !== y)
        smallestRowValues[i] = Math.min(smallestRowValues[i], grid[i][j]);
      if (j !== x)
        smallestColumnValues[j] = Math.min(smallestColumnValues[j], grid[i][j]);
    }
  }

  const filteredRowValues = smallestRowValues.filter(
    (val) => val !== Number.MAX_SAFE_INTEGER
  );

  const filteredColValues = smallestColumnValues.filter(
    (val) => val !== Number.MAX_SAFE_INTEGER
  );

  const minimumDistanceToEnd = [
    ...filteredRowValues,
    ...filteredColValues,
  ].reduce((acc, curr) => acc + curr, 0);

  return minimumDistanceToEnd;
};

const hasPointBeenSeenThisJourney = (currentPoint: JourneyPoint): boolean => {
  const { x, y, travelledPath } = currentPoint;
  const visitedGridPointKeys = travelledPath.split(";");
  const visitedCoordinates = visitedGridPointKeys
    .map((key) => {
      if (!key) return undefined;
      const [coordinates] = key.split("-");
      const [x, y] = coordinates.split(",").map((x) => parseInt(x, 10));
      return { x, y };
    })
    .filter(Boolean);

  return visitedCoordinates.some((point) => point!.x === x && point!.y === y);
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const startTime = new Date();

    const grid = data
      .split("\n")
      .map((row) => row.split("").map((x) => parseInt(x, 10)));

    const minimumDistancesGrid = grid.map((row, y) =>
      row.map((_, x) => getMinimumValueOfGridToEnd(x, y, grid))
    );
    const averagedGrid = grid.map((row, y) =>
      row.map((_, x) => getAverageValueOfGridToEnd(x, y, grid))
    );

    const seenPoints: { [key: string]: number } = {};
    const pointsToVisit: JourneyPoint[] = [
      {
        x: 0,
        y: 0,
        consecutiveStraightLines: 0,
        currentHeatLoss: 0,
        lastDirection: "right",
        travelledPath: "",
      },
    ];
    let bestJourney: JourneyPoint | undefined = undefined;

    let maxPointsToVisitSize = 0;
    let pointsVisited = 0;

    while (pointsToVisit.length) {
      const currentPoint = pointsToVisit.shift() as JourneyPoint;
      const { x, y, consecutiveStraightLines, currentHeatLoss, lastDirection } =
        currentPoint;

      if (x === grid[0].length - 1 && y === grid.length - 1) {
        if (!bestJourney || currentHeatLoss < bestJourney.currentHeatLoss) {
          console.log("Old pointsToVisit size", pointsToVisit.length);
          pointsToVisit.forEach((point, index) => {
            const minimumValueToEndFromHere = Math.floor(
              minimumValueToEnd(point, minimumDistancesGrid)
            );

            if (
              point.currentHeatLoss + minimumValueToEndFromHere >
              currentPoint.currentHeatLoss
            ) {
              pointsToVisit.splice(index, 1);
            }
          });

          bestJourney = currentPoint;

          const interimTime = new Date();
          console.log("New best journey found", bestJourney);
          console.log("Current pointsToVisit size", pointsToVisit.length);
          console.log(
            "Time taken",
            `${msToTime(interimTime.getTime() - startTime.getTime())}`
          );
          console.log("\n");
        }
        continue;
      }

      if (bestJourney && currentHeatLoss >= bestJourney.currentHeatLoss) {
        // console.log(
        //   "Filtered because currentHeatLoss >= bestJourney.currentHeatLoss"
        // );
        continue;
      }

      if (hasPointBeenSeenThisJourney(currentPoint)) {
        // console.log(
        //   "Filtered because hasPointBeenSeenThisJourney",
        // );
        continue;
      }

      if (
        seenPoints[getGridPointKey(currentPoint)] &&
        seenPoints[getGridPointKey(currentPoint)] <= currentHeatLoss
      ) {
        // if (currentPoint.y === 0) {
        //   console.log(
        //     `Filtered because seenPoints[getGridPointKey(currentPoint)] <= currentHeatLoss`
        //   );
        //   console.log(currentPoint);
        //   console.log(getGridPointKey(currentPoint));
        //   console.log(seenPoints[getGridPointKey(currentPoint)]);
        // }
        continue;
      }

      seenPoints[getGridPointKey(currentPoint)] = currentHeatLoss;

      const minimumValueToEndFromHere = Math.floor(
        minimumValueToEnd(currentPoint, minimumDistancesGrid)
      );

      if (
        bestJourney &&
        minimumValueToEndFromHere > bestJourney.currentHeatLoss
      ) {
        // console.log(
        //   "Filtered because minimumValueToEndFromHere > bestJourney.currentHeatLoss"
        // );
        continue;
      }

      if (
        x > 0 &&
        lastDirection !== "right" &&
        (lastDirection !== "left" || consecutiveStraightLines < 3)
      ) {
        const nextPoint = getNextPoint({
          x: x - 1,
          y,
          direction: "left",
          currentPoint,
          grid,
        });

        if (nextPoint) pointsToVisit.push(nextPoint);
      }

      if (
        x < grid[0].length - 1 &&
        lastDirection !== "left" &&
        (lastDirection !== "right" || consecutiveStraightLines < 3)
      ) {
        const nextPoint = getNextPoint({
          x: x + 1,
          y,
          direction: "right",
          currentPoint,
          grid,
        });

        if (nextPoint) pointsToVisit.push(nextPoint);
      }
      if (
        y > 0 &&
        lastDirection !== "down" &&
        (lastDirection !== "up" || consecutiveStraightLines < 3)
      ) {
        const nextPoint = getNextPoint({
          x,
          y: y - 1,
          direction: "up",
          currentPoint,
          grid,
        });

        if (nextPoint) pointsToVisit.push(nextPoint);
      }
      if (
        y < grid.length - 1 &&
        lastDirection !== "up" &&
        (lastDirection !== "down" || consecutiveStraightLines < 3)
      ) {
        const nextPoint = getNextPoint({
          x,
          y: y + 1,
          direction: "down",
          currentPoint,
          grid,
        });

        if (nextPoint) pointsToVisit.push(nextPoint);
      }

      // Sort by hueristic
      pointsToVisit.sort((a, b) => {
        return a.currentHeatLoss - b.currentHeatLoss;

        // const chosenHueristic = bestJourney
        //   ? expectedValueToEnd
        //   : distanceToEnd;
        // return (
        //   chosenHueristic(a, averagedGrid) - chosenHueristic(b, averagedGrid)
        // );
      });

      // if (
      //   Math.max(maxPointsToVisitSize, pointsToVisit.length) ===
      //   pointsToVisit.length
      // ) {
      //   console.log("New max pointsToVisit size", pointsToVisit.length);
      //   console.log("Current pointsVisited", pointsVisited);
      //   console.log("Current best journey", bestJourney?.currentHeatLoss);
      //   console.log("");
      // }

      maxPointsToVisitSize = Math.max(
        maxPointsToVisitSize,
        pointsToVisit.length
      );
      pointsVisited++;

      if (pointsVisited % 10000 === 0) {
        console.log("Current pointsVisited", pointsVisited);
        console.log("Points in queue count", pointsToVisit.length);
        console.log("seenPoints Size", Object.keys(seenPoints).length);
        console.log("maxPointsToVisitSize", maxPointsToVisitSize);
        console.log("Current best journey", bestJourney?.currentHeatLoss);
        console.log(
          currentPoint.x,
          currentPoint.y,
          currentHeatLoss,
          currentPoint.travelledPath.split(";").length
        );
        console.log(
          "Time taken",
          `${msToTime(new Date().getTime() - startTime.getTime())}`
        );
        console.log("");
      }
    }
    // Object.keys(seenPoints)
    //   .sort()
    //   .forEach((key) => {
    //     console.log(key, seenPoints[key]);
    //   });

    console.log("seenPoints Size", Object.keys(seenPoints).length);
    console.log("maxPointsToVisitSize", maxPointsToVisitSize);
    console.log("pointsVisited", pointsVisited);

    if (!bestJourney) throw new Error("No best journey found");

    console.log(bestJourney);
    printPathToGrid(grid, bestJourney.travelledPath);

    const endTime = new Date();
    console.log(
      "Time taken",
      `${msToTime(endTime.getTime() - startTime.getTime())}`
    );

    // console.log(
    //   "Part 1 Solution -",
    //   getEnergisedPointCount(grid, { x: 0, y: 0, direction: "right" })
    // );
    // console.log(
    //   "Part 2 Solution -",
    //   energisedCounts.reduce((acc, curr) => Math.max(acc, curr), 0)
    // );
  }
);
