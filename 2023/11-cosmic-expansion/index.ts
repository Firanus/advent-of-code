import path from "path";
import fs from "fs";

const sumDistanceBetweenGalaxies = (
  grid: string[][],
  sizeOfEmptySpace: number
) => {
  const rowsWithoutGalaxy = grid.reduce(
    (acc, row, index) => (!row.includes("#") ? [...acc, index] : acc),
    [] as number[]
  );

  const columns = grid[0].map((_, i) => grid.map((row) => row[i]));
  const columnsWithoutGalaxy = columns.reduce(
    (acc, col, index) => (!col.includes("#") ? [...acc, index] : acc),
    [] as number[]
  );

  const galaxyPoints = grid.flatMap((row, y) =>
    row.flatMap((col, x) => (col === "#" ? [[x, y]] : []))
  );

  const hamiltonianDistancesBetweenPoints: number[] = [];
  for (let i = 0; i < galaxyPoints.length; i++) {
    const point1 = galaxyPoints[i];
    for (let j = i + 1; j < galaxyPoints.length; j++) {
      const point2 = galaxyPoints[j];

      let distance = 0;
      for (
        let x = Math.min(point1[0], point2[0]);
        x < Math.max(point1[0], point2[0]);
        x++
      ) {
        if (columnsWithoutGalaxy.includes(x)) {
          distance += sizeOfEmptySpace;
        } else {
          distance++;
        }
      }
      for (
        let y = Math.min(point1[1], point2[1]);
        y < Math.max(point1[1], point2[1]);
        y++
      ) {
        if (rowsWithoutGalaxy.includes(y)) {
          distance += sizeOfEmptySpace;
        } else {
          distance++;
        }
      }
      hamiltonianDistancesBetweenPoints.push(distance);
    }
  }

  return hamiltonianDistancesBetweenPoints.reduce((acc, curr) => acc + curr);
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const grid = data.split("\n").map((row) => row.split(""));

    console.log("Part 1 Solution -", sumDistanceBetweenGalaxies(grid, 2));
    console.log("Part 2 Solution -", sumDistanceBetweenGalaxies(grid, 1000000));
  }
);
