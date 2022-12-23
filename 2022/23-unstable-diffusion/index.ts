import path from "path";
import fs from "fs";

type GridPoint = "." | "#";
type Grid = GridPoint[][];
type Direction = "N" | "S" | "E" | "W";
type Point = { x: number; y: number };
type MoveMap = { [encodedStartCoordinate: string]: string };
type DestinationMoveCounter = { [encodedEndCoordinate: string]: number };

const addRowToBottomOfGrid = (grid: Grid) =>
  grid.push(new Array(grid[0].length).fill("."));
const addRowToTopOfGrid = (grid: Grid) =>
  grid.unshift(new Array(grid[0].length).fill("."));
const addColumnToStartOfGrid = (grid: Grid) =>
  grid.forEach((row) => row.unshift("."));
const addColumnToEndOfGrid = (grid: Grid) =>
  grid.forEach((row) => row.push("."));

const compressGrid = (grid: Grid) => {
  while (true) {
    if (grid[0].every((p) => p === ".")) {
      grid.shift();
    } else {
      break;
    }
  }

  while (true) {
    if (grid[grid.length - 1].every((p) => p === ".")) {
      grid.pop();
    } else {
      break;
    }
  }

  while (true) {
    const firstColumn = grid.map((row) => row[0]);
    if (firstColumn.every((p) => p === ".")) {
      grid.forEach((row) => row.shift());
    } else {
      break;
    }
  }

  while (true) {
    const lastColumn = grid.map((row) => row[row.length - 1]);
    if (lastColumn.every((p) => p === ".")) {
      grid.forEach((row) => row.pop());
    } else {
      break;
    }
  }
};

const encodeCoordinate = (y: number, x: number) => `${x}_${y}`;
const decodeCoordinate = (key: string): Point => {
  const [x, y] = key.split("_");
  return { x: parseInt(x), y: parseInt(y) };
};

const moveCoordinatesInMapRight = (map: MoveMap): MoveMap => {
  const newMoveMap: MoveMap = {};
  Object.keys(map).map((key) => {
    const decodedKey = decodeCoordinate(key);
    const decodedValue = decodeCoordinate(map[key]);
    newMoveMap[encodeCoordinate(decodedKey.y, decodedKey.x + 1)] =
      encodeCoordinate(decodedValue.y, decodedValue.x + 1);
  });
  return newMoveMap;
};
const moveCoordinatesInMapDown = (map: MoveMap): MoveMap => {
  const newMoveMap: MoveMap = {};
  Object.keys(map).map((key) => {
    const decodedKey = decodeCoordinate(key);
    const decodedValue = decodeCoordinate(map[key]);
    newMoveMap[encodeCoordinate(decodedKey.y + 1, decodedKey.x)] =
      encodeCoordinate(decodedValue.y + 1, decodedValue.x);
  });
  return newMoveMap;
};

const generateDestinationCounter = (map: MoveMap): DestinationMoveCounter =>
  Object.values(map).reduce<{
    [key: string]: number;
  }>((acc, curr) => {
    acc[curr] = (acc[curr] ?? 0) + 1;
    return acc;
  }, {});

const isElfUnsurrounded = (start: Point, grid: Grid) => {
  const { y, x } = start;

  const isNWFree = y === 0 || x === 0 || grid[y - 1][x - 1] === ".";
  const isNFree = y === 0 || grid[y - 1][x] === ".";
  const isNEFree =
    y === 0 || x === grid[0].length - 1 || grid[y - 1][x + 1] === ".";
  const isEFree = x === grid[0].length - 1 || grid[y][x + 1] === ".";
  const isSEFree =
    y === grid.length - 1 ||
    x === grid[0].length - 1 ||
    grid[y + 1][x + 1] === ".";
  const isSFree = y === grid.length - 1 || grid[y + 1][x] === ".";
  const isSWFree =
    y === grid.length - 1 || x === 0 || grid[y + 1][x - 1] === ".";
  const isWFree = x === 0 || grid[y][x - 1] === ".";

  return (
    isEFree &&
    isNEFree &&
    isNFree &&
    isNWFree &&
    isWFree &&
    isSWFree &&
    isSEFree &&
    isSFree
  );
};

const isMoveInDirectionFree = (
  start: Point,
  direction: Direction,
  grid: Grid
): Point | undefined => {
  const { y, x } = start;

  const isNWFree = y === 0 || x === 0 || grid[y - 1][x - 1] === ".";
  const isNFree = y === 0 || grid[y - 1][x] === ".";
  const isNEFree =
    y === 0 || x === grid[0].length - 1 || grid[y - 1][x + 1] === ".";
  const isEFree = x === grid[0].length - 1 || grid[y][x + 1] === ".";
  const isSEFree =
    y === grid.length - 1 ||
    x === grid[0].length - 1 ||
    grid[y + 1][x + 1] === ".";
  const isSFree = y === grid.length - 1 || grid[y + 1][x] === ".";
  const isSWFree =
    y === grid.length - 1 || x === 0 || grid[y + 1][x - 1] === ".";
  const isWFree = x === 0 || grid[y][x - 1] === ".";

  switch (direction) {
    case "N":
      if (isNEFree && isNFree && isNWFree) {
        return { y: y - 1, x };
      }
      return undefined;
    case "S":
      if (isSEFree && isSFree && isSWFree) {
        return { y: y + 1, x };
      }
      return undefined;
    case "W":
      if (isSWFree && isWFree && isNWFree) {
        return { y, x: x - 1 };
      }
      return undefined;
    case "E":
      if (isNEFree && isEFree && isSEFree) {
        return { y, x: x + 1 };
      }
      return undefined;
  }
};

const visualiseGrid = (grid: Grid) => {
  grid.forEach((row) => console.log(row.join("")));
  console.log("\n");
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const grid: Grid = data
      .split("\n")
      .map((rowS) => rowS.split("") as GridPoint[]);

    visualiseGrid(grid);

    let moveCount = 0;
    let allElvesUnsurrounded = false;
    const moveOrder: Direction[] = ["N", "S", "W", "E"];

    const MOVE_TO_COUNT_EMPTY_POINTS = 10;
    let emptyPointCount = 0;

    while (!allElvesUnsurrounded) {
      let proposedMoves: MoveMap = {};

      allElvesUnsurrounded = true;
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
          const coordinate = grid[y][x];
          if (coordinate === ".") continue;

          if (isElfUnsurrounded({ y, x }, grid)) {
            continue;
          } else {
            allElvesUnsurrounded = false;
          }

          for (let i = 0; i < moveOrder.length; i++) {
            const directionToTry = moveOrder[i];
            const resultSpot = isMoveInDirectionFree(
              { y, x },
              directionToTry,
              grid
            );
            if (resultSpot !== undefined) {
              proposedMoves[encodeCoordinate(y, x)] = encodeCoordinate(
                resultSpot.y,
                resultSpot.x
              );
              break;
            }
          }
        }
      }

      let destinationCounter = generateDestinationCounter(proposedMoves);

      let coordinatesToMove = Object.keys(proposedMoves);
      for (let i = 0; i < coordinatesToMove.length; i++) {
        const startCoordinateEncoded = coordinatesToMove[i];
        const endCoordinateEncoded = proposedMoves[startCoordinateEncoded];
        const isSharedDestination =
          destinationCounter[endCoordinateEncoded] > 1;
        if (isSharedDestination) {
          continue;
        }

        const start = decodeCoordinate(startCoordinateEncoded);
        const end = decodeCoordinate(endCoordinateEncoded);

        if (end.y === -1) {
          addRowToTopOfGrid(grid);
          proposedMoves = moveCoordinatesInMapDown(proposedMoves);
          destinationCounter = generateDestinationCounter(proposedMoves);
          coordinatesToMove = Object.keys(proposedMoves);
          start.y = start.y + 1;
          end.y = end.y + 1;
        }
        if (end.x === -1) {
          addColumnToStartOfGrid(grid);
          proposedMoves = moveCoordinatesInMapRight(proposedMoves);
          destinationCounter = generateDestinationCounter(proposedMoves);
          coordinatesToMove = Object.keys(proposedMoves);
          start.x = start.x + 1;
          end.x = end.x + 1;
        }
        if (end.x === grid[0].length) {
          addColumnToEndOfGrid(grid);
        }
        if (end.y === grid.length) {
          addRowToBottomOfGrid(grid);
        }

        grid[start.y][start.x] = ".";
        grid[end.y][end.x] = "#";
      }

      moveCount += 1;
      const firstDirection = moveOrder.shift()!;
      moveOrder.push(firstDirection);

      if (moveCount === MOVE_TO_COUNT_EMPTY_POINTS) {
        compressGrid(grid);
        emptyPointCount = grid.reduce(
          (acc, row) => acc + row.filter((p) => p === ".").length,
          0
        );
      }

      visualiseGrid(grid);
    }

    compressGrid(grid);
    visualiseGrid(grid);
    console.log("Part 1 Solution:", emptyPointCount);
    console.log("Part 2 Solution:", moveCount);
  }
);
