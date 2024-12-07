import path from "path";
import fs from "fs";
import { start } from "repl";
import { get } from "http";

const encodePosition = (
  row: number,
  col: number,
  direction: Direction
): string => `${row},${col},${direction}`;
const decodePosition = (position: string): [number, number, Direction] => {
  const [row, col, direction] = position.split(",").map((n) => parseInt(n, 10));
  return [row, col, direction];
};
const visualiseMap = (map: string[][]): void => {
  console.log(map.map((row) => row.join("")).join("\n"));
};

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const map = data.split("\n").map((line) => line.split(""));
    const startRow = map.findIndex((row) => row.includes("^"));
    const startCol = map[startRow].indexOf("^");
    const startDirection = Direction.Up;

    const [visitedPositions] = walkPath(
      startRow,
      startCol,
      startDirection,
      map
    );

    const uniqVisitedPositions = getUniqVisitedPositions(visitedPositions);
    console.log("Part 1 Solution - ", uniqVisitedPositions.length);

    let loopedPathCount = 0;
    for (let i = 0; i < uniqVisitedPositions.length; i++) {
      if (i % 100 === 0)
        console.log(i, "paths walked of", uniqVisitedPositions.length);
      if (
        encodePosition(startRow, startCol, startDirection) ===
        uniqVisitedPositions[i]
      )
        continue;

      const [row, col] = decodePosition(uniqVisitedPositions[i]);
      const newMap = map.map((row) => [...row]);
      newMap[row][col] = "#";

      const [_, hasLoop] = walkPath(startRow, startCol, startDirection, newMap);
      if (hasLoop) loopedPathCount++;
    }

    console.log("Part 2 Solution - ", loopedPathCount);
  }
);

const walkPath = (
  startRow: number,
  startCol: number,
  startDirection: Direction,
  map: string[][]
): [string[], boolean] => {
  const visitedPositions: string[] = [];
  let row = startRow;
  let col = startCol;
  let direction = startDirection;

  while (!hasLeftArea(row, col, map)) {
    if (startRow === 7 && startCol === 6) {
      console.log("Current position", row, col, direction);
    }
    if (visitedPositions.includes(encodePosition(row, col, direction))) {
      return [visitedPositions, true];
    }

    visitedPositions.push(encodePosition(row, col, direction));
    [row, col, direction] = move(row, col, direction, map);
  }

  return [visitedPositions, false];
};

const move = (
  row: number,
  col: number,
  direction: Direction,
  map: string[][]
): [number, number, Direction] => {
  let [nextRow, nextCol] = getNextPosition(row, col, direction);
  let currentDirection = direction;
  while (isWall(nextRow, nextCol, map)) {
    currentDirection = turn(currentDirection);
    [nextRow, nextCol] = getNextPosition(row, col, currentDirection);
  }

  return [nextRow, nextCol, currentDirection];
};

const getNextPosition = (
  row: number,
  col: number,
  direction: Direction
): [number, number] => {
  switch (direction) {
    case Direction.Up:
      return [row - 1, col];
    case Direction.Right:
      return [row, col + 1];
    case Direction.Down:
      return [row + 1, col];
    case Direction.Left:
      return [row, col - 1];
  }
};

const isWall = (row: number, col: number, map: string[][]): boolean => {
  if (hasLeftArea(row, col, map)) return false;
  return map[row][col] === "#";
};

const hasLeftArea = (row: number, col: number, map: string[][]): boolean => {
  return row < 0 || row >= map.length || col < 0 || col >= map[0].length;
};

const turn = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.Up:
      return Direction.Right;
    case Direction.Right:
      return Direction.Down;
    case Direction.Down:
      return Direction.Left;
    case Direction.Left:
      return Direction.Up;
  }
};

const getUniqVisitedPositions = (visitedPositions: string[]): string[] => {
  const positionsWithoutDirection = visitedPositions.map((p) => {
    const [row, col, _] = decodePosition(p);
    return `${row},${col}`;
  });
  const visitedPositionsSet = new Set(positionsWithoutDirection);
  return [...visitedPositionsSet];
};
