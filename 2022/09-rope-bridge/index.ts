import path from "path";
import fs from "fs";

type Direction = "U" | "L" | "D" | "R";
type MovementInstruction = { direction: Direction; distance: number };
type Point = { x: number; y: number };

const encodePoint = (point: Point): string => `${point.x}-${point.y}`;

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const headMovementInstructions: MovementInstruction[] = data
      .split("\n")
      .map((rawInstruction) => {
        const [directionStr, distanceStr] = rawInstruction.split(" ");
        return {
          direction: directionStr as Direction,
          distance: parseInt(distanceStr, 10),
        };
      });

    const headPosition: Point = { x: 0, y: 0 };
    const tailCount = 9;
    const tailPositions: Point[] = [];
    const visitedTailPoints: Set<string>[] = [];

    for (let i = 0; i < tailCount; i++) {
      const newTail = { x: 0, y: 0 };
      tailPositions.push(newTail);
      visitedTailPoints.push(new Set<string>());
    }

    headMovementInstructions.forEach((instruction) => {
      for (let i = 0; i < instruction.distance; i++) {
        switch (instruction.direction) {
          case "U":
            headPosition.y += 1;
            break;
          case "D":
            headPosition.y -= 1;
            break;
          case "L":
            headPosition.x -= 1;
            break;
          case "R":
            headPosition.x += 1;
            break;
        }

        const allRopePoints = [headPosition, ...tailPositions];
        for (let j = 1; j < allRopePoints.length; j++) {
          const localHeadPosition = allRopePoints[j - 1];
          const localTailPosition = allRopePoints[j];
          if (Math.abs(localHeadPosition.x - localTailPosition.x) > 1) {
            if (localHeadPosition.x > localTailPosition.x) {
              localTailPosition.x = localHeadPosition.x - 1;
            } else {
              localTailPosition.x = localHeadPosition.x + 1;
            }
            if (localHeadPosition.y > localTailPosition.y) {
              localTailPosition.y += 1;
            } else if (localHeadPosition.y < localTailPosition.y) {
              localTailPosition.y -= 1;
            }
          } else if (Math.abs(localHeadPosition.y - localTailPosition.y) > 1) {
            if (localHeadPosition.y > localTailPosition.y) {
              localTailPosition.y = localHeadPosition.y - 1;
            } else {
              localTailPosition.y = localHeadPosition.y + 1;
            }
            if (localHeadPosition.x > localTailPosition.x) {
              localTailPosition.x += 1;
            } else if (localHeadPosition.x < localTailPosition.x) {
              localTailPosition.x -= 1;
            }
          }

          visitedTailPoints[j - 1].add(encodePoint(localTailPosition));
        }
      }
    });

    console.log("Part 1 Solution:", visitedTailPoints[0].size);
    console.log("Part 2 Solution:", visitedTailPoints[8].size);
  }
);
