import path from "path";
import fs from "fs";

type Point = { x: number; y: number; z: number };
type DropletGrid = boolean[][][];
type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

const encodePoint = ({ x, y, z }: Point) => `${x},${y},${z}`;

const getPointsAirReaches = (dropletGrid: DropletGrid): Set<string> => {
  const CUBE_SIZE = dropletGrid.length;
  const COLUMN_SIZE = dropletGrid[0].length;
  const ROW_SIZE = dropletGrid[0][0].length;

  const pointsToVisit: Point[] = [{ x: 0, y: 0, z: 0 }];
  const visitedPoints: { [key: string]: boolean } = {};

  while (pointsToVisit.length > 0) {
    const pointToVisit = pointsToVisit.shift()!;
    const { x, y, z } = pointToVisit;
    if (visitedPoints[encodePoint(pointToVisit)] || dropletGrid[z][y][x]) {
      continue;
    }

    if (x > 0 && !dropletGrid[z][y][x - 1]) {
      pointsToVisit.push({ x: x - 1, y, z });
    }
    if (x < ROW_SIZE - 1 && !dropletGrid[z][y][x + 1]) {
      pointsToVisit.push({ x: x + 1, y, z });
    }
    if (y > 0 && !dropletGrid[z][y - 1][x]) {
      pointsToVisit.push({ x, y: y - 1, z });
    }
    if (y < COLUMN_SIZE - 1 && !dropletGrid[z][y + 1][x]) {
      pointsToVisit.push({ x, y: y + 1, z });
    }
    if (z > 0 && !dropletGrid[z - 1][y][x]) {
      pointsToVisit.push({ x, y, z: z - 1 });
    }
    if (z < CUBE_SIZE - 1 && !dropletGrid[z + 1][y][x]) {
      pointsToVisit.push({ x, y, z: z + 1 });
    }

    visitedPoints[encodePoint(pointToVisit)] = true;
  }

  return new Set(Object.keys(visitedPoints));
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const points: Point[] = data.split("\n").map((str) => {
      const [x, y, z] = str.split(",");
      return { x: parseInt(x, 10), y: parseInt(y, 10), z: parseInt(z, 10) };
    });

    const bounds = points.reduce<Bounds>(
      (acc, curr) => ({
        minX: Math.min(acc.minX, curr.x),
        minY: Math.min(acc.minY, curr.y),
        minZ: Math.min(acc.minZ, curr.z),
        maxX: Math.max(acc.maxX, curr.x),
        maxY: Math.max(acc.maxY, curr.y),
        maxZ: Math.max(acc.maxZ, curr.z),
      }),
      {
        minX: Number.POSITIVE_INFINITY,
        minY: Number.POSITIVE_INFINITY,
        minZ: Number.POSITIVE_INFINITY,
        maxX: Number.NEGATIVE_INFINITY,
        maxY: Number.NEGATIVE_INFINITY,
        maxZ: Number.NEGATIVE_INFINITY,
      }
    );
    bounds.minX -= 1;
    bounds.minY -= 1;
    bounds.minZ -= 1;
    bounds.maxX += 1;
    bounds.maxY += 1;
    bounds.maxZ += 1;
    const dropletGrid: DropletGrid = [
      ...Array(bounds.maxZ - bounds.minZ + 1),
    ].map(() =>
      [...new Array(bounds.maxY - bounds.minY + 1)].map(() =>
        Array(bounds.maxX - bounds.minX + 1).fill(false)
      )
    );

    for (let i = 0; i < points.length; i++) {
      const { x, y, z } = points[i];
      dropletGrid[z - bounds.minZ][y - bounds.minY][x - bounds.minX] = true;
    }

    const calculateSurfaceArea = (
      dropletGrid: DropletGrid,
      points: Point[],
      b: Bounds
    ): number => {
      let totalSurfaceArea = 0;
      points.sort((a, b) => a.z - b.z);
      for (let i = 0; i < points.length; i++) {
        const { x, y, z } = points[i];
        const { minX, minY, minZ } = b;
        const normX = x - minX;
        const normY = y - minY;
        const normZ = z - minZ;

        if (dropletGrid[normZ][normY][normX - 1] === false)
          totalSurfaceArea += 1;
        if (dropletGrid[normZ][normY][normX + 1] === false)
          totalSurfaceArea += 1;
        if (dropletGrid[normZ][normY - 1][normX] === false)
          totalSurfaceArea += 1;
        if (dropletGrid[normZ][normY + 1][normX] === false)
          totalSurfaceArea += 1;
        if (dropletGrid[normZ - 1][normY][normX] === false)
          totalSurfaceArea += 1;
        if (dropletGrid[normZ + 1][normY][normX] === false)
          totalSurfaceArea += 1;
      }
      return totalSurfaceArea;
    };

    // We look at the shape from each direction and add 1 to the SF from the direction we see it.
    const getSurfaceAreaOfExternalPoints = (
      dropletGrid: DropletGrid,
      points: Point[],
      b: Bounds
    ): number => {
      let totalSurfaceArea = 0;
      const pointsCoveredByAir = getPointsAirReaches(dropletGrid);

      for (let i = 0; i < points.length; i++) {
        const { x, y, z } = points[i];
        const { minX, minY, minZ } = b;
        const normX = x - minX;
        const normY = y - minY;
        const normZ = z - minZ;

        if (
          pointsCoveredByAir.has(
            encodePoint({ z: normZ, y: normY, x: normX - 1 })
          )
        )
          totalSurfaceArea += 1;
        if (
          pointsCoveredByAir.has(
            encodePoint({ z: normZ, y: normY, x: normX + 1 })
          )
        )
          totalSurfaceArea += 1;
        if (
          pointsCoveredByAir.has(
            encodePoint({ z: normZ, y: normY - 1, x: normX })
          )
        )
          totalSurfaceArea += 1;
        if (
          pointsCoveredByAir.has(
            encodePoint({ z: normZ, y: normY + 1, x: normX })
          )
        )
          totalSurfaceArea += 1;
        if (
          pointsCoveredByAir.has(
            encodePoint({ z: normZ - 1, y: normY, x: normX })
          )
        )
          totalSurfaceArea += 1;
        if (
          pointsCoveredByAir.has(
            encodePoint({ z: normZ + 1, y: normY, x: normX })
          )
        )
          totalSurfaceArea += 1;
      }
      return totalSurfaceArea;
    };

    const totalSurfaceArea = calculateSurfaceArea(dropletGrid, points, bounds);
    const externalSurfaceArea = getSurfaceAreaOfExternalPoints(
      dropletGrid,
      points,
      bounds
    );

    console.log("Part 1 Solution:", totalSurfaceArea);
    console.log("Part 2 Solution:", externalSurfaceArea);
  }
);
