import path from "path";
import fs from "fs";

const expandGrid = (grid: string[][]) => {
  const rowsWithoutGalaxy = grid.reduce(
    (acc, row, index) => (!row.includes("#") ? [...acc, index] : acc),
    [] as number[]
  );

  const columns = grid[0].map((_, i) => grid.map((row) => row[i]));
  const columnsWithoutGalaxy = columns.reduce(
    (acc, col, index) => (!col.includes("#") ? [...acc, index] : acc),
    [] as number[]
  );

  const expandedGrid = grid.flatMap((row, index) => {
    const expandedRow = row.flatMap((col, index) => {
      if (columnsWithoutGalaxy.includes(index)) {
        return [col, col];
      }

      return [col];
    });

    if (rowsWithoutGalaxy.includes(index)) {
      return [expandedRow, expandedRow];
    }

    return [expandedRow];
  });

  return expandedGrid;
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
    const expandedGrid = expandGrid(grid);

    const galaxyPoints = expandedGrid.flatMap((row, y) =>
      row.flatMap((col, x) => (col === "#" ? [[x, y]] : []))
    );

    const hamiltonianDistancesBetweenPoints: number[] = [];
    for (let i = 0; i < galaxyPoints.length; i++) {
      const point1 = galaxyPoints[i];
      for (let j = i + 1; j < galaxyPoints.length; j++) {
        const point2 = galaxyPoints[j];
        hamiltonianDistancesBetweenPoints.push(
          Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1])
        );
      }
    }

    console.log(
      "Part 1 Solution -",
      hamiltonianDistancesBetweenPoints.reduce((acc, curr) => acc + curr)
    );
  }
);
