import path from "path";
import fs from "fs";

type Blizzard = "L" | "R" | "U" | "D";

interface Node {
  x: number;
  y: number;
  isWall: Boolean;
  blizzards: Blizzard[];
}
type Map = Node[][];
type Point = { x: number; y: number };
type PositionToExplore = { pos: Point; minute: number };

const parseInputForBlizzard = (str: string): Blizzard[] => {
  if (str === "<") return ["L"];
  if (str === ">") return ["R"];
  if (str === "^") return ["U"];
  if (str === "v") return ["D"];

  if (str === "#" || str === ".") {
    return [];
  }
  throw new Error("Unknown input character");
};

const encodePositionToExplore = ({ pos, minute }: PositionToExplore) =>
  `${pos.x}_${pos.y}_${minute}`;

const getMoveablePositions = (start: Point, map: Map): Point[] => {
  const { y, x } = start;
  const moveablePoints: Point[] = [];

  if (map[y][x].blizzards.length === 0) moveablePoints.push({ y, x });
  if (y > 0 && !map[y - 1][x].isWall && map[y - 1][x].blizzards.length === 0)
    moveablePoints.push({ y: y - 1, x });
  if (
    y < map.length - 1 &&
    !map[y + 1][x].isWall &&
    map[y + 1][x].blizzards.length === 0
  )
    moveablePoints.push({ y: y + 1, x });
  if (!map[y][x - 1].isWall && map[y][x - 1].blizzards.length === 0)
    moveablePoints.push({ y, x: x - 1 });
  if (!map[y][x + 1].isWall && map[y][x + 1].blizzards.length === 0)
    moveablePoints.push({ y, x: x + 1 });

  return moveablePoints;
};

const visualiseMap = (map: Map, elfPosition?: Point) => {
  map.forEach((row) => {
    console.log(
      row
        .map(({ isWall, blizzards, x, y }) => {
          if (x === elfPosition?.x && y === elfPosition?.y) return "E";
          if (isWall) return "#";
          if (blizzards.length > 1) return blizzards.length.toString();
          if (blizzards[0] === "L") return "<";
          if (blizzards[0] === "R") return ">";
          if (blizzards[0] === "U") return "^";
          if (blizzards[0] === "D") return "v";
          return ".";
        })
        .join("")
    );
  });
  console.log("");
};

const calculateNextBasinState = (map: Map): Map => {
  const newMap: Map = [];
  map.forEach((row, y) => {
    newMap.push([]);
    row.forEach((node, x) =>
      newMap[y].push({ x, y, isWall: node.isWall, blizzards: [] })
    );
  });

  map.forEach((row) => {
    row.forEach(({ x, y, blizzards }) => {
      if (blizzards.length == 0) {
        return;
      }

      for (let i = 0; i < blizzards.length; i++) {
        const blizzard = blizzards[i];
        if (blizzard === "L") {
          const isNextSpaceWall = row[x - 1].isWall;
          if (isNextSpaceWall) {
            newMap[y][row.length - 2].blizzards.push("L");
          } else {
            newMap[y][x - 1].blizzards.push("L");
          }
        }
        if (blizzard === "R") {
          const isNextSpaceWall = row[x + 1].isWall;
          if (isNextSpaceWall) {
            newMap[y][1].blizzards.push("R");
          } else {
            newMap[y][x + 1].blizzards.push("R");
          }
        }
        if (blizzard === "D") {
          const isNextSpaceWall = map[y + 1][x].isWall;
          if (isNextSpaceWall) {
            newMap[1][x].blizzards.push("D");
          } else {
            newMap[y + 1][x].blizzards.push("D");
          }
        }
        if (blizzard === "U") {
          const isNextSpaceWall = map[y - 1][x].isWall;
          if (isNextSpaceWall) {
            newMap[map.length - 2][x].blizzards.push("U");
          } else {
            newMap[y - 1][x].blizzards.push("U");
          }
        }
      }
    });
  });

  return newMap;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("Preparing all basin states...");
    const initialMap: Map = data.split("\n").map((row, rowIndex) =>
      row.split("").map((str, colIndex) => ({
        x: colIndex,
        y: rowIndex,
        isWall: str === "#",
        blizzards: parseInputForBlizzard(str),
      }))
    );

    // Basin state will loop after length * width iterations.
    const basinStates: Map[] = [initialMap];

    const maxNumberOfBasinStates =
      (initialMap.length - 2) * (initialMap[0].length - 2);
    for (let i = 0; i < maxNumberOfBasinStates; i++) {
      const previousBasinState = basinStates[i];
      const nextBasinState = calculateNextBasinState(previousBasinState);
      basinStates.push(nextBasinState);
    }
    console.log("All basin states prepared. Total number:", basinStates.length);

    const runGame = (
      initialPosition: Point,
      finalPosition: Point,
      startingMinute: number
    ): number => {
      const positionsToExplore: PositionToExplore[] = [
        { pos: { ...initialPosition }, minute: startingMinute },
      ];
      let hasReachedEnd = false;
      let minutesToEnd: number = -1;

      const visitedPositions: { [encodedPosition: string]: boolean } = {};

      while (!hasReachedEnd) {
        const positionToExplore = positionsToExplore.shift()!;
        if (visitedPositions[encodePositionToExplore(positionToExplore)]) {
          continue;
        }
        const { minute, pos } = positionToExplore;

        if (pos.x === finalPosition.x && pos.y === finalPosition.y) {
          hasReachedEnd = true;
          minutesToEnd = minute;
          break;
        }

        const map = basinStates[(minute + 1) % maxNumberOfBasinStates];
        const moveablePoints = getMoveablePositions(pos, map);

        visitedPositions[encodePositionToExplore(positionToExplore)] = true;
        positionsToExplore.push(
          ...moveablePoints
            .map((p) => ({ pos: p, minute: minute + 1 }))
            .filter((p) => !visitedPositions[encodePositionToExplore(p)])
        );

        positionsToExplore.sort((a, b) => a.minute - b.minute);
      }
      return minutesToEnd;
    };

    const initialPosition: Point = { x: 1, y: 0 };
    const finalPosition: Point = {
      x: initialMap[0].length - 2,
      y: initialMap.length - 1,
    };

    console.log("");
    console.log(
      `Starting journey from ${initialPosition.x},${initialPosition.y} to ${finalPosition.x},${finalPosition.y}`
    );
    const startToEndTime = runGame(initialPosition, finalPosition, 0);
    console.log(
      `Finished journey from ${initialPosition.x},${initialPosition.y} to ${finalPosition.x},${finalPosition.y}`
    );
    console.log("Time taken:", startToEndTime);
    console.log("");

    console.log(
      `Starting journey from ${finalPosition.x},${finalPosition.y} to ${initialPosition.x},${initialPosition.y}`
    );
    const endBackToStart = runGame(
      finalPosition,
      initialPosition,
      startToEndTime
    );
    console.log(
      `Finished journey from ${finalPosition.x},${finalPosition.y} to ${initialPosition.x},${initialPosition.y}`
    );
    console.log("Time taken:", endBackToStart - startToEndTime);
    console.log("");

    console.log(
      `Starting journey from ${initialPosition.x},${initialPosition.y} to ${finalPosition.x},${finalPosition.y}`
    );
    const backToEndTime = runGame(
      initialPosition,
      finalPosition,
      endBackToStart
    );
    console.log(
      `Finished journey from ${initialPosition.x},${initialPosition.y} to ${finalPosition.x},${finalPosition.y}`
    );
    console.log("Time taken:", backToEndTime - endBackToStart);
    console.log("");

    console.log("Part 1 Solution:", startToEndTime);
    console.log("Part 2 Solution:", backToEndTime);
  }
);
