const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const [gridPointsInput, foldInstructionsInput] = data.split("\n\n");
  const gridPoints = gridPointsInput
    .split("\n")
    .map((x) => x.split(",").map((y) => parseInt(y)));
  const foldLines = foldInstructionsInput.split("\n").map((x) => {
    const [letter, number] = x.split(" ")[2].split("=");
    return [letter, parseInt(number)];
  });

  const initialGridHeight =
    gridPoints.reduce((acc, curr) => Math.max(acc, curr[1]), -1) + 1;
  const initialGridWidth =
    gridPoints.reduce((acc, curr) => Math.max(acc, curr[0]), -1) + 1;

  let grid = Array(initialGridHeight)
    .fill(false)
    .map(() => Array(initialGridWidth).fill(false));

  for (let i = 0; i < gridPoints.length; i++) {
    const [x, y] = gridPoints[i];
    grid[y][x] = true;
  }

  for (let i = 0; i < foldLines.length; i++) {
    const foldLine = foldLines[i];
    grid = foldGridAlongLine(grid, foldLine);
  }

  // Part 1 code
  // const visibleDots = grid.reduce((acc, curr) => {
  //   return acc + curr.filter((x) => !!x).length;
  // }, 0);
  // console.log(visibleDots);

  // Part 2 code
  visualiseGrid(grid);
});

const foldGridAlongLine = (grid, foldLine) => {
  const [direction, position] = foldLine;

  if (direction === "x") {
    return foldGridAlongVerticalLine(grid, position);
  } else {
    return foldGridAlongHorizontalLine(grid, position);
  }
};

const foldGridAlongVerticalLine = (grid, position) => {
  const newGrid = Array(grid.length)
    .fill(false)
    .map(() => Array(position).fill(false));
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const val = grid[i][j];
      if (j > position) {
        const distanceFromLine = j - position;
        newGrid[i][position - distanceFromLine] =
          grid[i][position - distanceFromLine] || val;
      } else if (j === position) {
        continue;
      } else {
        newGrid[i][j] = grid[i][j] || val;
      }
    }
  }

  return newGrid;
};

const foldGridAlongHorizontalLine = (grid, position) => {
  const newGrid = Array(position)
    .fill(false)
    .map(() => Array(grid[0].length).fill(false));
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const val = grid[i][j];
      if (i > position) {
        const distanceFromLine = i - position;
        newGrid[position - distanceFromLine][j] =
          grid[position - distanceFromLine][j] || val;
      } else if (i === position) {
        continue;
      } else {
        newGrid[i][j] = grid[i][j] || val;
      }
    }
  }

  return newGrid;
};

const visualiseGrid = (grid) => {
  let gridString = "";
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const val = grid[i][j];
      gridString += val ? "#" : ".";
      if (j === grid[0].length - 1) {
        gridString += "\n";
      }
    }
  }
  console.log(gridString);
};
