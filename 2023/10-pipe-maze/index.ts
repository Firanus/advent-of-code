import path from "path";
import fs from "fs";
import exp from "constants";
import { Pipe } from "stream";

type PipeType = "|" | "-" | "L" | "J" | "F" | "7" | "." | "S";

type Point = {
  x: number;
  y: number;
};

// Number is distance from start
type ExploredPipesMap = { [key: string]: number };

type PipesToExploreQueue = Point[];

const getPointKey = (x: number, y: number) => `${x},${y}`;

const addPointToQueue = (
  x: number,
  y: number,
  distanceFromStart: number,
  queue: PipesToExploreQueue,
  exploredPoints: ExploredPipesMap,
  grid: PipeType[][]
) => {
  const key = getPointKey(x, y);
  if (
    exploredPoints[key] === undefined &&
    x >= 0 &&
    y >= 0 &&
    x < grid[0].length &&
    y < grid.length
  ) {
    queue.push({ x, y });
    exploredPoints[key] = distanceFromStart;
  }
};

const exploreSurroundingPoints = (
  x: number,
  y: number,
  queue: PipesToExploreQueue,
  exploredPoints: ExploredPipesMap,
  grid: PipeType[][]
) => {
  const key = getPointKey(x, y);
  const distanceFromStart = exploredPoints[key];
  const pipeType = grid[y][x];

  const newDist = distanceFromStart + 1;
  switch (pipeType) {
    case "|":
      addPointToQueue(x, y - 1, newDist, queue, exploredPoints, grid);
      addPointToQueue(x, y + 1, newDist, queue, exploredPoints, grid);
      break;
    case "-":
      addPointToQueue(x - 1, y, newDist, queue, exploredPoints, grid);
      addPointToQueue(x + 1, y, newDist, queue, exploredPoints, grid);
      break;
    case "L":
      addPointToQueue(x, y - 1, newDist, queue, exploredPoints, grid);
      addPointToQueue(x + 1, y, newDist, queue, exploredPoints, grid);
      break;
    case "J":
      addPointToQueue(x, y - 1, newDist, queue, exploredPoints, grid);
      addPointToQueue(x - 1, y, newDist, queue, exploredPoints, grid);
      break;
    case "F":
      addPointToQueue(x + 1, y, newDist, queue, exploredPoints, grid);
      addPointToQueue(x, y + 1, newDist, queue, exploredPoints, grid);
      break;
    case "7":
      addPointToQueue(x, y + 1, newDist, queue, exploredPoints, grid);
      addPointToQueue(x - 1, y, newDist, queue, exploredPoints, grid);
      break;
    case "S":
      y + 1 < grid.length &&
        (grid[y + 1][x] === "|" ||
          grid[y + 1][x] === "J" ||
          grid[y + 1][x] === "L") &&
        addPointToQueue(x, y + 1, newDist, queue, exploredPoints, grid);
      y - 1 >= 0 &&
        (grid[y - 1][x] === "|" ||
          grid[y - 1][x] === "7" ||
          grid[y - 1][x] === "F") &&
        addPointToQueue(x, y - 1, newDist, queue, exploredPoints, grid);
      x + 1 < grid[0].length &&
        (grid[y][x - 1] === "-" ||
          grid[y][x - 1] === "L" ||
          grid[y][x - 1] === "F") &&
        addPointToQueue(x - 1, y, newDist, queue, exploredPoints, grid);
      x - 1 >= 0 &&
        (grid[y][x + 1] === "-" ||
          grid[y][x + 1] === "J" ||
          grid[y][x + 1] === "7") &&
        addPointToQueue(x + 1, y, newDist, queue, exploredPoints, grid);
      break;
  }
};

const floodFill = (grid: PipeType[][]) => {
  const gridCopy: string[][] = grid.map((row) => [...row]);

  const pointsToExplore: Point[] = [{ x: 0, y: 0 }];

  while (pointsToExplore.length) {
    const point = pointsToExplore.shift();
    if (point) {
      const { x, y } = point;
      if (x < 0 || y < 0 || x >= gridCopy[0].length || y >= gridCopy.length) {
        continue;
      }
      if (gridCopy[y][x] === ".") {
        gridCopy[y][x] = "O";
        pointsToExplore.push({ x: x - 1, y });
        pointsToExplore.push({ x: x + 1, y });
        pointsToExplore.push({ x, y: y - 1 });
        pointsToExplore.push({ x, y: y + 1 });
      }
    }
  }
  return gridCopy;
};

const tripleGridResolution = (grid: PipeType[][]) =>
  grid
    .map((row) =>
      row
        .map((shape) => {
          switch (shape) {
            case "L":
              return ".|.\n.L-\n...";
            case "J":
              return ".|.\n-J.\n...";
            case "F":
              return "...\n.F-\n.|.";
            case "7":
              return "...\n-7.\n.|.";
            case "S":
              return ".|.\n-S-\n.|.";
            case "-":
              return "...\n---\n...";
            case "|":
              return ".|.\n.|.\n.|.";
            case ".":
              return "...\n...\n...";
          }
        })
        .reduce<PipeType[][]>(
          (acc, curr) => {
            const splitCurr = curr.split("\n");
            for (let i = 0; i < splitCurr.length; i++) {
              acc[i].push(...(splitCurr[i].split("") as PipeType[]));
            }
            return acc;
          },
          [[], [], []]
        )
    )
    .reduce<PipeType[][]>((acc, curr) => {
      for (let i = 0; i < curr.length; i++) {
        acc.push(curr[i]);
      }
      return acc;
    }, []);

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const grid = data
      .split("\n")
      .map((row) => row.split("").map((shape) => shape as PipeType));

    const startingY = grid.findIndex((row) => row.includes("S"));
    const startingX = grid[startingY].indexOf("S");

    const pointsToExplore: Point[] = [{ x: startingX, y: startingY }];
    const exploredPoints: ExploredPipesMap = {
      [getPointKey(startingX, startingY)]: 0,
    };

    while (pointsToExplore.length) {
      const point = pointsToExplore.shift();
      if (point) {
        exploreSurroundingPoints(
          point.x,
          point.y,
          pointsToExplore,
          exploredPoints,
          grid
        );
      }
    }

    console.log(
      "Part 1 Solution -",
      Object.values(exploredPoints).reduce(
        (acc, curr) => Math.max(acc, curr),
        0
      )
    );

    const gridWithoutNonExploredPipes = grid.map((row, y) =>
      row.map((shape, x) =>
        exploredPoints[getPointKey(x, y)] !== undefined ? shape : "."
      )
    );

    const trippledRes = tripleGridResolution(gridWithoutNonExploredPipes);

    const floodFilledGrid = floodFill(trippledRes);

    const unfilledCountTripRes = floodFilledGrid.reduce(
      (acc, curr, y) =>
        acc +
        curr.reduce(
          (acc, rowCurr, x) =>
            rowCurr === "." && y % 3 === 1 && x % 3 === 1 ? acc + 1 : acc,
          0
        ),
      0
    );

    console.log("Part 2 Solution -", unfilledCountTripRes);
  }
);
