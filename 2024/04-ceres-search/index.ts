import path from "path";
import fs from "fs";

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const grid = data.split("\n").map((line) => line.split(""));
    const height = grid.length;
    const width = grid[0].length;

    const partOneSolution = grid.reduce((sol, row, y) => {
      return (
        sol +
        row.reduce((acc, cell, x) => {
          if (cell !== "X") {
            return acc;
          }
          return acc + evaluateCellPartOne(x, y, grid);
        }, 0)
      );
    }, 0);

    const partTwoSolution = grid.reduce((sol, row, y) => {
      return (
        sol +
        row.reduce((acc, cell, x) => {
          if (
            y === 0 ||
            y === height - 1 ||
            x === 0 ||
            x === width - 1 ||
            cell !== "A"
          ) {
            return acc;
          }
          return acc + evaluateCellPartTwo(x, y, grid);
        }, 0)
      );
    }, 0);

    console.log("Part 1 Solution - ", partOneSolution);
    console.log("Part 2 Solution - ", partTwoSolution);
  }
);

const evaluateCellPartOne = (
  x: number,
  y: number,
  grid: string[][]
): number => {
  const height = grid.length;
  const width = grid[0].length;
  let count = 0;
  if (
    x < width - 3 &&
    grid[y][x + 1] === "M" &&
    grid[y][x + 2] === "A" &&
    grid[y][x + 3] === "S"
  ) {
    count++;
  }
  if (
    x > 2 &&
    grid[y][x - 1] === "M" &&
    grid[y][x - 2] === "A" &&
    grid[y][x - 3] === "S"
  ) {
    count++;
  }
  if (
    y < height - 3 &&
    grid[y + 1][x] === "M" &&
    grid[y + 2][x] === "A" &&
    grid[y + 3][x] === "S"
  ) {
    count++;
  }
  if (
    y > 2 &&
    grid[y - 1][x] === "M" &&
    grid[y - 2][x] === "A" &&
    grid[y - 3][x] === "S"
  ) {
    count++;
  }
  if (
    x < width - 3 &&
    y < height - 3 &&
    grid[y + 1][x + 1] === "M" &&
    grid[y + 2][x + 2] === "A" &&
    grid[y + 3][x + 3] === "S"
  ) {
    count++;
  }
  if (
    x < width - 3 &&
    y > 2 &&
    grid[y - 1][x + 1] === "M" &&
    grid[y - 2][x + 2] === "A" &&
    grid[y - 3][x + 3] === "S"
  ) {
    count++;
  }
  if (
    x > 2 &&
    y < height - 3 &&
    grid[y + 1][x - 1] === "M" &&
    grid[y + 2][x - 2] === "A" &&
    grid[y + 3][x - 3] === "S"
  ) {
    count++;
  }
  if (
    x > 2 &&
    y > 2 &&
    grid[y - 1][x - 1] === "M" &&
    grid[y - 2][x - 2] === "A" &&
    grid[y - 3][x - 3] === "S"
  ) {
    count++;
  }

  return count;
};

const evaluateCellPartTwo = (
  x: number,
  y: number,
  grid: string[][]
): number => {
  let count = 0;
  if (
    grid[y - 1][x - 1] === "M" &&
    grid[y + 1][x - 1] === "M" &&
    grid[y - 1][x + 1] === "S" &&
    grid[y + 1][x + 1] === "S"
  ) {
    count++;
  }

  if (
    grid[y - 1][x - 1] === "M" &&
    grid[y + 1][x - 1] === "S" &&
    grid[y - 1][x + 1] === "M" &&
    grid[y + 1][x + 1] === "S"
  ) {
    count++;
  }

  if (
    grid[y - 1][x - 1] === "S" &&
    grid[y + 1][x - 1] === "M" &&
    grid[y - 1][x + 1] === "S" &&
    grid[y + 1][x + 1] === "M"
  ) {
    count++;
  }

  if (
    grid[y - 1][x - 1] === "S" &&
    grid[y + 1][x - 1] === "S" &&
    grid[y - 1][x + 1] === "M" &&
    grid[y + 1][x + 1] === "M"
  ) {
    count++;
  }

  return count;
};
