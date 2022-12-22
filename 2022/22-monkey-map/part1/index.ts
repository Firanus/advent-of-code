import path from "path";
import fs from "fs";

type MapCoordinate = " " | "." | "#";
type Facing = "L" | "U" | "R" | "D";
type Instruction = number | "L" | "R";
type Point = { x: number; y: number };

const turn = (initialFacing: Facing, direction: "L" | "R"): Facing => {
  switch (initialFacing) {
    case "U":
      return direction === "L" ? "L" : "R";
    case "R":
      return direction === "L" ? "U" : "D";
    case "D":
      return direction === "L" ? "R" : "L";
    case "L":
      return direction === "L" ? "D" : "U";
  }
};

const getValueForFacing = (facing: Facing) => {
  switch (facing) {
    case "R":
      return 0;
    case "D":
      return 1;
    case "L":
      return 2;
    case "U":
      return 3;
  }
};

const isHorizontal = (facing: Facing) => facing === "L" || facing === "R";
const isStandable = (coord: MapCoordinate) => coord === ".";
const getReversedCoordinate = (coord: number, row: MapCoordinate[]) =>
  row.length - 1 - coord;

const moveAlongRow = (
  position: number,
  row: MapCoordinate[],
  reverse: boolean
): number => {
  if (!isStandable(row[position]))
    throw new Error("Standing in invalid position");
  const workingRow = reverse ? [...row].reverse() : [...row];
  const workingCoordinate = reverse
    ? getReversedCoordinate(position, row)
    : position;

  let nextPosition = workingCoordinate + 1;
  if (nextPosition < 0) {
    nextPosition = workingRow.length - 1;
  }
  if (nextPosition > workingRow.length - 1) {
    nextPosition = 0;
  }

  const curr = workingRow[nextPosition];
  if (curr === "#") {
    return position;
  }
  if (curr === ".") {
    return reverse ? getReversedCoordinate(nextPosition, row) : nextPosition;
  }

  const distanceToNonEmptySpot = workingRow
    .slice(nextPosition)
    .findIndex((x) => x !== " ");
  if (distanceToNonEmptySpot > -1) {
    const newCoord = nextPosition + distanceToNonEmptySpot;
    const skipCurr = workingRow[newCoord];
    return skipCurr === "#"
      ? position
      : reverse
      ? getReversedCoordinate(newCoord, row)
      : newCoord;
  }

  const positionFromStartOfRow = workingRow.findIndex((x) => x !== " ");
  const skipCurr = workingRow[positionFromStartOfRow];
  return skipCurr === "#"
    ? position
    : reverse
    ? getReversedCoordinate(positionFromStartOfRow, row)
    : positionFromStartOfRow;
};

const move = (
  initialPosition: Point,
  direction: Facing,
  distance: number,
  map: MapCoordinate[][]
): Point => {
  if (isHorizontal(direction)) {
    const row = map[initialPosition.y];
    let xCoordinate = initialPosition.x;
    for (let i = 0; i < distance; i++) {
      xCoordinate = moveAlongRow(xCoordinate, row, direction === "L");
    }
    return { x: xCoordinate, y: initialPosition.y };
  }

  const column = map
    .map((row) => row[initialPosition.x])
    .filter((y) => y !== undefined);
  let yCoordinate = initialPosition.y;
  for (let i = 0; i < distance; i++) {
    yCoordinate = moveAlongRow(yCoordinate, column, direction === "U");
  }
  return { x: initialPosition.x, y: yCoordinate };
};

fs.readFile(
  path.resolve(__dirname, "../input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const [rawMap, rawInstructions] = data.split("\n\n");
    const map = rawMap.split("\n").map((x) => x.split("") as MapCoordinate[]);
    const instructions: Instruction[] = [];

    let buffer = "";
    for (let i = 0; i < rawInstructions.length; i++) {
      const curr = rawInstructions[i];
      if (curr === "L" || curr === "R") {
        const number = parseInt(buffer, 10);
        instructions.push(number);
        instructions.push(curr);
        buffer = "";
      } else {
        buffer += curr;
      }
    }
    if (buffer) {
      const number = parseInt(buffer, 10);
      instructions.push(number);
    }

    const initialXCoordinate = map[0].indexOf(".");

    let facing: Facing = "R";
    let position: Point = { y: 0, x: initialXCoordinate };

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      if (instruction === "L" || instruction === "R") {
        facing = turn(facing, instruction);
      } else {
        position = move(position, facing, instruction, map);
      }
    }

    const part1Solution =
      1000 * (position.y + 1) +
      4 * (position.x + 1) +
      getValueForFacing(facing);
    console.log("Part 1 Solution:", part1Solution);
  }
);
