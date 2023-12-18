import path from "path";
import fs from "fs";

const directionToVectorMap: { [key: string]: { x: number; y: number } } = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const instructions = data.split("\n").map((row) => {
      const [direction, sizeStr, rawColorStr] = row.split(" ");

      const size = parseInt(sizeStr, 10);
      const directionVector = directionToVectorMap[direction];
      const color = rawColorStr.slice(1, rawColorStr.length - 1);

      return { directionVector, size, color };
    });

    // Approximate grid dimensions
    const totalDown = instructions.reduce(
      (acc, curr) => acc + (curr.directionVector.y > 0 ? curr.size : 0),
      1
    );
    const totalRight = instructions.reduce(
      (acc, curr) => acc + (curr.directionVector.x > 0 ? curr.size : 0),
      1
    );

    let grid: string[][] = [];
    for (let i = 0; i < 2 * totalDown; i++) {
      grid.push([]);
      for (let j = 0; j < 2 * totalRight; j++) {
        grid[i].push(".");
      }
    }

    let currentX = totalDown - 1;
    let currentY = totalRight - 1;

    instructions.forEach((instruction) => {
      const { directionVector, size } = instruction;
      const initialX = currentX;
      const initialY = currentY;
      currentX += directionVector.x * size;
      currentY += directionVector.y * size;

      for (
        let x = Math.min(initialX, currentX);
        x <= Math.max(initialX, currentX);
        x++
      ) {
        for (
          let y = Math.min(initialY, currentY);
          y <= Math.max(initialY, currentY);
          y++
        ) {
          grid[y][x] = "#";
        }
      }
    });

    grid = grid.filter((row) => row.some((val) => val === "#"));

    // Fill in the gaps
    grid.forEach((row, y) => {
      let parity = 0;
      let isEdge = false;
      row.forEach((val, x) => {
        const leftIsUnfilled = x === 0 || grid[y][x - 1] !== "#";
        const rightIsUnfilled = x === row.length - 1 || grid[y][x + 1] !== "#";
        const aboveIsWall = y > 0 && grid[y - 1][x] === "#";
        const rightIsWall = x < row.length - 1 && grid[y][x + 1] === "#";
        const leftIsWall = x > 0 && grid[y][x - 1] === "#";

        if (
          val === "#" &&
          aboveIsWall &&
          ((leftIsUnfilled && rightIsWall) ||
            (rightIsUnfilled && leftIsWall) ||
            (leftIsUnfilled && rightIsUnfilled))
        ) {
          parity += 1;
        }

        if (val === "." && parity % 2 === 1) {
          grid[y][x] = "F";
        }
      });
    });

    const filledSpaces = grid.reduce(
      (acc, row) =>
        acc + row.reduce((rowAcc, curr) => rowAcc + (curr !== "." ? 1 : 0), 0),
      0
    );

    console.log(grid.map((row) => row.join("")).join("\n"));
    console.log("Part 1 Solution -", filledSpaces);
  }
);
