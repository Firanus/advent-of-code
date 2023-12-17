import path from "path";
import fs from "fs";

type Direction = "up" | "down" | "left" | "right";

type Beam = {
  x: number;
  y: number;
  direction: Direction;
};

const generateBeamKey = (beam: Beam) => `${beam.x},${beam.y}-${beam.direction}`;

const getEnergisedPointCount = (grid: string[][], initialBeam: Beam) => {
  const energisedGridPoints = grid.map((row) => row.map((_) => false));

  const beams: Beam[] = [initialBeam];
  const seenPoints = new Set<string>();

  while (beams.length > 0) {
    const beam = beams.pop();
    if (!beam) continue;

    const { x, y, direction } = beam;
    if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) continue;

    if (seenPoints.has(generateBeamKey(beam))) continue;

    seenPoints.add(generateBeamKey(beam));

    energisedGridPoints[y][x] = true;
    const currentGridPoint = grid[y][x];

    switch (currentGridPoint) {
      case ".":
        if (direction === "right") {
          beams.push({ x: x + 1, y, direction: "right" });
        } else if (direction === "left") {
          beams.push({ x: x - 1, y, direction: "left" });
        } else if (direction === "up") {
          beams.push({ x, y: y - 1, direction: "up" });
        } else if (direction === "down") {
          beams.push({ x, y: y + 1, direction: "down" });
        }
        break;
      case "/":
        if (direction === "right") {
          beams.push({ x, y: y - 1, direction: "up" });
        } else if (direction === "left") {
          beams.push({ x, y: y + 1, direction: "down" });
        } else if (direction === "up") {
          beams.push({ x: x + 1, y, direction: "right" });
        } else if (direction === "down") {
          beams.push({ x: x - 1, y, direction: "left" });
        }
        break;
      case "\\":
        if (direction === "right") {
          beams.push({ x, y: y + 1, direction: "down" });
        } else if (direction === "left") {
          beams.push({ x, y: y - 1, direction: "up" });
        } else if (direction === "up") {
          beams.push({ x: x - 1, y, direction: "left" });
        } else if (direction === "down") {
          beams.push({ x: x + 1, y, direction: "right" });
        }
        break;
      case "-":
        if (direction === "right") {
          beams.push({ x: x + 1, y, direction: "right" });
        } else if (direction === "left") {
          beams.push({ x: x - 1, y, direction: "left" });
        } else if (direction === "up" || direction === "down") {
          beams.push({ x: x + 1, y, direction: "right" });
          beams.push({ x: x - 1, y, direction: "left" });
        }
        break;
      case "|":
        if (direction === "down") {
          beams.push({ x, y: y + 1, direction: "down" });
        } else if (direction === "up") {
          beams.push({ x, y: y - 1, direction: "up" });
        } else if (direction === "left" || direction === "right") {
          beams.push({ x, y: y + 1, direction: "down" });
          beams.push({ x, y: y - 1, direction: "up" });
        }
        break;
    }
  }

  return energisedGridPoints.reduce(
    (acc, row) =>
      acc + row.reduce((rowAcc, curr) => rowAcc + (curr ? 1 : 0), 0),
    0
  );
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

    const allStartBeams: Beam[] = [
      ...grid.map((_, y) => ({ x: 0, y, direction: "right" as Direction })),
      ...grid.map((_, y) => ({
        x: grid[0].length - 1,
        y,
        direction: "left" as Direction,
      })),
      ...grid[0].map((_, x) => ({ x, y: 0, direction: "down" as Direction })),
      ...grid[0].map((_, x) => ({
        x,
        y: grid.length - 1,
        direction: "up" as Direction,
      })),
    ];

    const energisedCounts = allStartBeams.map((beam) =>
      getEnergisedPointCount(grid, beam)
    );

    console.log(
      "Part 1 Solution -",
      getEnergisedPointCount(grid, { x: 0, y: 0, direction: "right" })
    );
    console.log(
      "Part 2 Solution -",
      energisedCounts.reduce((acc, curr) => Math.max(acc, curr), 0)
    );
  }
);
