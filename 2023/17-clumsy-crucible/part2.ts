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

const printPathToGrid = (grid: number[][], path: string) => {
  const gridCopy = grid.map((row) => row.map((x) => x.toString()));

  path.split(";").forEach((point) => {
    const [coordinates] = point.split("-");
    const [x, y] = coordinates.split(",").map((x) => parseInt(x, 10));
    gridCopy[y][x] = "*";
  });

  console.log(gridCopy.map((row) => row.join("")).join("\n"), "\n");
};

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

const getNextPoints = ({
  currentPoint,
  grid,
}: {
  currentPoint: JourneyPoint;
  grid: number[][];
}) => {
  const canTurn = currentPoint.consecutiveStraightLines > 3;
  const canGoStraight = currentPoint.consecutiveStraightLines < 10;

  const nextPoints: JourneyPoint[] = [];

  if (canGoStraight) {
    let newX = currentPoint.x;
    let newY = currentPoint.y;

    const {
      currentHeatLoss,
      lastDirection,
      consecutiveStraightLines,
      travelledPath,
    } = currentPoint;

    switch (lastDirection) {
      case "up":
        newY--;
        break;
      case "down":
        newY++;
        break;
      case "left":
        newX--;
        break;
      case "right":
        newX++;
        break;
    }

    if (newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length) {
      const nextPoint = {
        x: newX,
        y: newY,
        consecutiveStraightLines: consecutiveStraightLines + 1,
        currentHeatLoss: currentHeatLoss + grid[newY][newX],
        lastDirection,
        travelledPath: `${
          travelledPath ? travelledPath + ";" : ""
        }${getGridPointKey(currentPoint)}`,
      };
      nextPoints.push(nextPoint);
    }
  }

  if (canTurn) {
    const { currentHeatLoss, lastDirection, travelledPath } = currentPoint;

    const dirs =
      lastDirection === "up" || lastDirection === "down"
        ? ["left", "right"]
        : ["up", "down"];

    dirs.forEach((dir) => {
      const { x, y } = currentPoint;
      const newX = dir === "left" ? x - 1 : dir === "right" ? x + 1 : x;
      const newY = dir === "up" ? y - 1 : dir === "down" ? y + 1 : y;
      if (
        newX >= 0 &&
        newX < grid[0].length &&
        newY >= 0 &&
        newY < grid.length
      ) {
        const nextPoint = {
          x: newX,
          y: newY,
          consecutiveStraightLines: 1,
          currentHeatLoss: currentHeatLoss + grid[newY][newX],
          lastDirection: dir as Direction,
          travelledPath: `${
            travelledPath ? travelledPath + ";" : ""
          }${getGridPointKey(currentPoint)}`,
        };
        nextPoints.push(nextPoint);
      }
    });
  }

  return nextPoints;
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
      {
        x: 0,
        y: 0,
        consecutiveStraightLines: 0,
        currentHeatLoss: 0,
        lastDirection: "down",
        travelledPath: "",
      },
    ];
    let bestJourney: JourneyPoint | undefined = undefined;

    let maxPointsToVisitSize = 0;
    let pointsVisited = 0;

    while (pointsToVisit.length) {
      const currentPoint = pointsToVisit.shift() as JourneyPoint;
      const { x, y, consecutiveStraightLines, currentHeatLoss } = currentPoint;

      const canStop = consecutiveStraightLines > 3;
      if (x === grid[0].length - 1 && y === grid.length - 1) {
        if (
          canStop &&
          (!bestJourney || currentHeatLoss < bestJourney.currentHeatLoss)
        ) {
          bestJourney = currentPoint;
        }
        continue;
      }

      if (bestJourney && currentHeatLoss >= bestJourney.currentHeatLoss) {
        continue;
      }

      if (
        seenPoints[getGridPointKey(currentPoint)] &&
        seenPoints[getGridPointKey(currentPoint)] <= currentHeatLoss
      ) {
        continue;
      }

      seenPoints[getGridPointKey(currentPoint)] = currentHeatLoss;

      const nextPoints = getNextPoints({ currentPoint, grid });
      pointsToVisit.push(...nextPoints);

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
