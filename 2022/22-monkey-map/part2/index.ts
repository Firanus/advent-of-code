import path from "path";
import fs from "fs";

type MapCoordinate = {
  originalGridPosition: Point;
  neighbouringCoordinates: {
    [key: string]: { coordinate: MapCoordinate; rotation?: "L" | "R" | "LL" };
  };
  type: "." | "#";
};
type Facing = "L" | "U" | "R" | "D";
type Instruction = number | "L" | "R";
type Point = { x: number; y: number };

function isNonNullable<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

const turn = (initialFacing: Facing, direction: "L" | "R" | "LL"): Facing => {
  switch (initialFacing) {
    case "U":
      if (direction === "LL") return "D";
      return direction === "L" ? "L" : "R";
    case "R":
      if (direction === "LL") return "L";
      return direction === "L" ? "U" : "D";
    case "D":
      if (direction === "LL") return "U";
      return direction === "L" ? "R" : "L";
    case "L":
      if (direction === "LL") return "R";
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

const move = (
  currentPosition: MapCoordinate,
  direction: Facing,
  distance: number
): { coord: MapCoordinate; facing: Facing } => {
  if (currentPosition.type === "#")
    throw new Error("Should not be able to stand here");
  if (distance === 0) return { coord: currentPosition, facing: direction };

  const nextPosition = currentPosition.neighbouringCoordinates[direction];
  if (nextPosition.coordinate.type === "#") {
    return { coord: currentPosition, facing: direction };
  }

  return move(
    nextPosition.coordinate,
    nextPosition.rotation ? turn(direction, nextPosition.rotation) : direction,
    distance - 1
  );
};

const stitch = (
  firstCoord: MapCoordinate,
  firstStitchDirection: Facing,
  secondCoord: MapCoordinate,
  secondStitchDirection: Facing,
  rotation?: "L" | "R" | "LL"
) => {
  firstCoord.neighbouringCoordinates[firstStitchDirection] = {
    coordinate: secondCoord,
    rotation,
  };
  const oppositeRotation =
    rotation === "L" ? "R" : rotation === "R" ? "L" : rotation;
  secondCoord.neighbouringCoordinates[secondStitchDirection] = {
    coordinate: firstCoord,
    rotation: oppositeRotation,
  };
};

const getRow = (
  yCoord: number,
  xStart: number,
  xEnd: number,
  map: MapCoordinate[][]
): MapCoordinate[] => {
  const fullRow = map[yCoord];
  const row = fullRow.filter(
    ({ originalGridPosition }) =>
      originalGridPosition.x >= xStart && originalGridPosition.x < xEnd
  );
  return row;
};

const getColumn = (
  xCoord: number,
  yStart: number,
  yEnd: number,
  map: MapCoordinate[][]
): MapCoordinate[] => {
  const column = map
    .map((row) =>
      row.find(
        ({ originalGridPosition }) =>
          originalGridPosition.x === xCoord &&
          originalGridPosition.y >= yStart &&
          originalGridPosition.y < yEnd
      )
    )
    .filter(isNonNullable);
  return column;
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
    const map: MapCoordinate[][] = rawMap.split("\n").map((row, rowIndex) =>
      row
        .split("")
        .map((type, xIndex) => ({
          type: type as "." | "#", // Not strictly true, but we filter exceptions immediately
          originalGridPosition: { y: rowIndex, x: xIndex },
          neighbouringCoordinates: {},
        }))
        .filter((coord) => coord.type === "." || coord.type === "#")
    );

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

    map.forEach((row, y) =>
      row.forEach((coordinate, x) => {
        const { originalGridPosition } = coordinate;
        const next = row.find(
          (next) => next.originalGridPosition.x === originalGridPosition.x + 1
        );
        const prev = row.find(
          (next) => next.originalGridPosition.x === originalGridPosition.x - 1
        );
        const rowAbove = map[y - 1];
        const rowBelow = map[y + 1];
        const above =
          rowAbove &&
          rowAbove.find(
            (next) =>
              next.originalGridPosition.y === originalGridPosition.y - 1 &&
              next.originalGridPosition.x === originalGridPosition.x
          );
        const below =
          rowBelow &&
          rowBelow.find(
            (next) =>
              next.originalGridPosition.y === originalGridPosition.y + 1 &&
              next.originalGridPosition.x === originalGridPosition.x
          );

        if (next)
          coordinate.neighbouringCoordinates["R"] = { coordinate: next };
        if (prev)
          coordinate.neighbouringCoordinates["L"] = { coordinate: prev };
        if (above)
          coordinate.neighbouringCoordinates["U"] = { coordinate: above };
        if (below)
          coordinate.neighbouringCoordinates["D"] = { coordinate: below };
      })
    );

    type ZipInput = [
      MapCoordinate[],
      Facing,
      MapCoordinate[],
      Facing,
      "L" | "R" | "LL" | undefined
    ];
    // Stitching for test input
    // const zipInput: ZipInput[] = [
    //   [
    //     getRow(8, 12, 16, map),
    //     "U",
    //     getColumn(11, 4, 8, map).reverse(),
    //     "R",
    //     "L",
    //   ],
    //   [getRow(11, 8, 12, map), "D", getRow(7, 0, 4, map).reverse(), "D", "LL"],
    //   [getRow(4, 4, 8, map), "U", getColumn(8, 0, 4, map), "L", "R"],
    // ];

    // Stitching for real input
    const zipInput: ZipInput[] = [
      [getRow(49, 100, 150, map), "D", getColumn(99, 50, 100, map), "R", "R"], // 2 - 3
      [getRow(0, 50, 100, map), "U", getColumn(0, 150, 200, map), "L", "R"], // 1 - 6
      [
        getColumn(50, 0, 50, map),
        "L",
        getColumn(0, 100, 150, map).reverse(),
        "L",
        "LL",
      ], // 1 - 5
      [getRow(0, 100, 150, map), "U", getRow(199, 0, 50, map), "D", undefined], // 2-6
      [
        getColumn(149, 0, 50, map),
        "R",
        getColumn(99, 100, 150, map).reverse(),
        "R",
        "LL",
      ], // 2-4
      [getColumn(50, 50, 100, map), "L", getRow(100, 0, 50, map), "U", "L"], // 3-5
      [getRow(149, 50, 100, map), "D", getColumn(49, 150, 200, map), "R", "R"], // 4-6
    ];

    zipInput.forEach(([rowA, facingA, rowB, facingB, rotation]) =>
      (rowA as MapCoordinate[]).forEach((itemA, index) =>
        stitch(
          itemA,
          facingA as Facing,
          (rowB as MapCoordinate[])[index],
          facingB as Facing,
          rotation as "L" | "R" | "LL"
        )
      )
    );

    const initialCoordinate = map[0].find((coord) => coord.type === ".")!;

    let facing: Facing = "R";
    let currentCoordinate = initialCoordinate;

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      if (instruction === "L" || instruction === "R") {
        facing = turn(facing, instruction);
      } else {
        const result = move(currentCoordinate, facing, instruction);
        currentCoordinate = result.coord;
        facing = result.facing;
      }
    }

    const solution =
      1000 * (currentCoordinate.originalGridPosition.y + 1) +
      4 * (currentCoordinate.originalGridPosition.x + 1) +
      getValueForFacing(facing);
    console.log("Part 2 Solution:", solution);
  }
);
