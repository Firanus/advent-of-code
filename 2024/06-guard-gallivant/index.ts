import path from "path";
import fs from "fs";

const encodePosition = (row: number, col: number): string => `${row},${col}`;
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
    let row = map.findIndex((row) => row.includes("^"));
    let col = map[row].indexOf("^");
    let direction = Direction.Up;

    const visitedPositions: string[] = [];

    while (!hasLeftArea(row, col, map)) {
      visitedPositions.push(encodePosition(row, col));
      [row, col, direction] = move(row, col, direction, map);
    }

    console.log("Part 1 Solution - ", uniq(visitedPositions).length);
  }
);

const move = (
  row: number,
  col: number,
  direction: Direction,
  map: string[][]
): [number, number, Direction] => {
  let [nextRow, nextCol] = getNextPosition(row, col, direction);
  let currentDirection = direction;
  while (isWall(nextRow, nextCol, map)) {
    currentDirection = turn(direction);
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

const uniq = <T>(arr: T[]): T[] => Array.from(new Set(arr));
