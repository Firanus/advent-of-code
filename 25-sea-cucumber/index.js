const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let seaCucumberGrid = data.split("\n").map((row) => row.split(""));
  let stepCount = 0;

  let shouldContinue = true;

  while (shouldContinue) {
    const numbersOfMoves = makeStep(seaCucumberGrid);
    stepCount += 1;

    if (numbersOfMoves === 0) {
      shouldContinue = false;
    }
  }
  console.log(stepCount);
});

const makeStep = (grid) => {
  const rowCount = grid.length;
  const columnCount = grid[0].length;

  const cucumbersToMoveEast = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const char = grid[i][j];
      if (char === "." || char === "v") {
        continue;
      }

      const columnToInspect = j + 1 >= columnCount ? 0 : j + 1;
      if (grid[i][columnToInspect] === ".") {
        cucumbersToMoveEast.push([i, j]);
      }
    }
  }

  for (let i = 0; i < cucumbersToMoveEast.length; i++) {
    const [row, startCol] = cucumbersToMoveEast[i];
    let endCol = startCol + 1 >= columnCount ? 0 : startCol + 1;
    grid[row][startCol] = ".";
    grid[row][endCol] = ">";
  }

  const cucumbersToMoveSouth = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const char = grid[i][j];
      if (char === "." || char === ">") {
        continue;
      }

      const rowToInspect = i + 1 >= rowCount ? 0 : i + 1;
      if (grid[rowToInspect][j] === ".") {
        cucumbersToMoveSouth.push([i, j]);
      }
    }
  }

  for (let i = 0; i < cucumbersToMoveSouth.length; i++) {
    const [startRow, col] = cucumbersToMoveSouth[i];
    let endRow = startRow + 1 >= rowCount ? 0 : startRow + 1;
    grid[startRow][col] = ".";
    grid[endRow][col] = "v";
  }

  return cucumbersToMoveEast.length + cucumbersToMoveSouth.length;
};

const visualiseGrid = (grid) => {
  let returnString = "";
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      returnString += grid[i][j];
    }
    returnString += "\n";
  }
  console.log(returnString);
};
