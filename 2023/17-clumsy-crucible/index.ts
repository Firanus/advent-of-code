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

const minimumValueToEnd = (
  point: JourneyPoint,
  minimumTotalDistancesGrid: number[][]
) => {
  const minDistance = minimumTotalDistancesGrid[point.y][point.x];

  return point.currentHeatLoss + minDistance;
};

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
          bestJourney = currentPoint;
        }
        continue;
      }

      if (bestJourney && currentHeatLoss >= bestJourney.currentHeatLoss) {
        continue;
      }

      if (hasPointBeenSeenThisJourney(currentPoint)) {
        continue;
      }

      if (
        seenPoints[getGridPointKey(currentPoint)] &&
        seenPoints[getGridPointKey(currentPoint)] <= currentHeatLoss
      ) {
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
      });

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

    console.log("seenPoints Size", Object.keys(seenPoints).length);
    console.log("maxPointsToVisitSize", maxPointsToVisitSize);
    console.log("pointsVisited", pointsVisited);

    if (!bestJourney) throw new Error("No best journey found");

    console.log(bestJourney);

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
