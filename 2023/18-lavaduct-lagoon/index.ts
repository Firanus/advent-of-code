import path from "path";
import fs from "fs";

const directionToVectorMap: { [key: string]: { x: number; y: number } } = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

const determinant = (
  v1: { x: number; y: number },
  v2: { x: number; y: number }
) => v1.x * v2.y - v1.y * v2.x;

const getAreaFromCoordinates = (
  instructions: { directionVector: { x: number; y: number }; size: number }[]
) => {
  let currentX = 0;
  let currentY = 0;
  let currentArea = 0;
  let currentPerimeter = 0;

  instructions.forEach((instruction) => {
    const { directionVector, size } = instruction;
    const initialX = currentX;
    const initialY = currentY;
    currentX += directionVector.x * size;
    currentY += directionVector.y * size;

    // This calculation is based on the shoelace formula
    // https://en.wikipedia.org/wiki/Shoelace_formula
    currentArea +=
      determinant({ x: initialX, y: initialY }, { x: currentX, y: currentY }) /
      2;
    currentPerimeter +=
      Math.abs(initialX - currentX) + Math.abs(initialY - currentY);
  });

  // Shoelace only partially counts perimeter squares
  // One half of each square, and one quarter of outermost corners.
  // Hence, add half the perimeter to top those off, and one more to
  // account for the outermost corners.
  return currentArea + currentPerimeter / 2 + 1;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const [instructionsPart1, instructionsPart2] = data.split("\n").reduce(
      (acc, row) => {
        const [directionStrPart1, sizeStrPart1, rawColorStr] = row.split(" ");

        const sizePart1 = parseInt(sizeStrPart1, 10);
        const directionVectorP1 = directionToVectorMap[directionStrPart1];

        acc[0].push({ directionVector: directionVectorP1, size: sizePart1 });

        const directionStrPart2 = rawColorStr[7];
        let directionP2 = "";
        switch (directionStrPart2) {
          case "0":
            directionP2 = "R";
            break;
          case "1":
            directionP2 = "D";
            break;
          case "2":
            directionP2 = "L";
            break;
          case "3":
            directionP2 = "U";
            break;
          default:
            throw new Error("Unexpected input");
        }
        const directionVector = directionToVectorMap[directionP2];

        const size = parseInt(rawColorStr.slice(2, 7), 16);

        acc[1].push({ directionVector, size });
        return acc;
      },
      [[], []] as {
        directionVector: { x: number; y: number };
        size: number;
      }[][]
    );

    console.log("Part 1 Solution -", getAreaFromCoordinates(instructionsPart1));
    console.log("Part 2 Solution -", getAreaFromCoordinates(instructionsPart2));
  }
);
