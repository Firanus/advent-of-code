import path from "path";
import fs from "fs";

// Rotate grid ninety degrees clockwise
const rotateGrid = (grid: string[][]) =>
  grid[0].map((_, i) => grid.map((row) => row[i]).reverse());

const getGridString = (grid: string[][]) =>
  grid.map((row) => row.join("")).join("\n");

const rollBouldersNorth = (grid: string[][]) => {
  const newGrid = grid.map((row) => [...row]);

  let shouldContinue = true;

  while (shouldContinue) {
    let initialGridString = getGridString(newGrid);
    for (let i = 1; i < grid.length; i++) {
      const row = newGrid[i];
      for (let j = 0; j < row.length; j++) {
        const col = row[j];
        if (col === "O" && newGrid[i - 1][j] === ".") {
          newGrid[i - 1][j] = "O";
          newGrid[i][j] = ".";
        }
      }
    }

    if (initialGridString === getGridString(newGrid)) {
      shouldContinue = false;
    }
  }

  return newGrid;
};

const runSpinCycle = (grid: string[][]) => {
  const northGrid = rollBouldersNorth(grid);
  const eastGrid = rollBouldersNorth(rotateGrid(northGrid));
  const southGrid = rollBouldersNorth(rotateGrid(eastGrid));
  const westGrid = rollBouldersNorth(rotateGrid(southGrid));
  return rotateGrid(westGrid);
};

const getGridScore = (grid: string[][]) =>
  grid.reduce((acc, row, rowIndex, arr) => {
    return (
      acc +
      row.reduce(
        (acc, col) => (col === "O" ? acc + arr.length - rowIndex : acc),
        0
      )
    );
  }, 0);

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const grid = data.split("\n").map((row) => row.split(""));

    const rolledGrid = rollBouldersNorth(grid);

    let spunGrid = grid.map((row) => [...row]);

    const seenGrids = [getGridString(spunGrid)];
    for (let i = 0; i < 1000000000; i++) {
      spunGrid = runSpinCycle(spunGrid);
      console.log("Spun Grid", i + 1, "times");

      const newSpunGridString = getGridString(spunGrid);
      if (seenGrids.includes(newSpunGridString)) {
        const indexOfPreviousVisit = seenGrids.indexOf(newSpunGridString);
        const cycleLength = seenGrids.length - indexOfPreviousVisit;
        console.log("Cycle found at spin", i + 1, "of length", cycleLength);

        const remainingSpins = 1000000000 - (i + 1);
        const remainingSpinsInCycle = remainingSpins % cycleLength;
        const finalPosition = indexOfPreviousVisit + remainingSpinsInCycle;
        spunGrid = seenGrids[finalPosition]
          .split("\n")
          .map((row) => row.split(""));

        break;
      }
      seenGrids.push(getGridString(spunGrid));
    }

    console.log("Part 1 Solution -", getGridScore(rolledGrid));
    console.log("Part 2 Solution -", getGridScore(spunGrid));
  }
);
