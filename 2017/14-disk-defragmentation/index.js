const { createKnotHash } = require("../createKnotHash");

const testInput = "flqrgnkx";
const input = "hfdlxzhv";

const hashes = new Array(128)
  .fill(0)
  .map((_, index) => `${input}-${index}`)
  .map((x) => createKnotHash(x));

const transformKnotHash = (hash) =>
  hash
    .split("")
    .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
    .join("")
    .split("")
    .map((x) => x === "1");

const generateRegionKey = () => Math.random().toString(10);
const encodeCoordinate = (x, y) => `${x}-${y}`;

// Boolean grid
const grid = hashes.map(transformKnotHash);

const usedSpaces = grid
  .map((row) => row.reduce((acc, curr) => (!!curr ? acc + 1 : acc), 0))
  .reduce((acc, curr) => acc + curr, 0);

// dictionary of points keyed to a region.
const pointsToRegions = {};
// dictionary of regions keyed to an array of points.
const regionsToPoints = {};

for (let i = 0; i < grid.length; i++) {
  const row = grid[i];
  for (let j = 0; j < row.length; j++) {
    const bit = row[j];
    if (!bit) {
      continue;
    }

    const isUpperBitSet = i === 0 ? false : grid[i - 1][j];
    const isLeftBitSet = j === 0 ? false : grid[i][j - 1];

    if (!isUpperBitSet && !isLeftBitSet) {
      const regionKey = generateRegionKey();
      const encodedCoordinate = encodeCoordinate(j, i);
      pointsToRegions[encodedCoordinate] = regionKey;
      regionsToPoints[regionKey] = [encodedCoordinate];
    } else if (isUpperBitSet && !isLeftBitSet) {
      const regionOfUpperPoint = pointsToRegions[encodeCoordinate(j, i - 1)];
      const encodedCoordinate = encodeCoordinate(j, i);
      pointsToRegions[encodedCoordinate] = regionOfUpperPoint;

      const pointsArray = regionsToPoints[regionOfUpperPoint];
      regionsToPoints[regionOfUpperPoint] = [...pointsArray, encodedCoordinate];
    } else if (!isUpperBitSet && isLeftBitSet) {
      const regionOfLeftPoint = pointsToRegions[encodeCoordinate(j - 1, i)];
      const encodedCoordinate = encodeCoordinate(j, i);
      pointsToRegions[encodedCoordinate] = regionOfLeftPoint;

      const pointsArray = regionsToPoints[regionOfLeftPoint];
      regionsToPoints[regionOfLeftPoint] = [...pointsArray, encodedCoordinate];
    } else {
      // In this case, both left and upper are in a region. We need to reassign them to the same region.
      const regionOfUpperPoint = pointsToRegions[encodeCoordinate(j, i - 1)];
      const regionOfLeftPoint = pointsToRegions[encodeCoordinate(j - 1, i)];
      const encodedCoordinate = encodeCoordinate(j, i);

      const upperRegionPoints = regionsToPoints[regionOfUpperPoint];
      const leftRegionPoints = regionsToPoints[regionOfLeftPoint];

      if (regionOfLeftPoint === regionOfUpperPoint) {
        pointsToRegions[encodedCoordinate] = regionOfUpperPoint;
        regionsToPoints[regionOfUpperPoint] = [
          ...upperRegionPoints,
          encodedCoordinate,
        ];
        continue;
      }

      const combinedRegionPoints = [
        ...upperRegionPoints,
        ...leftRegionPoints,
        encodedCoordinate,
      ];

      combinedRegionPoints.forEach(
        (x) => (pointsToRegions[x] = regionOfUpperPoint)
      );
      regionsToPoints[regionOfUpperPoint] = combinedRegionPoints;
      delete regionsToPoints[regionOfLeftPoint];
    }
  }
}

const numberOfRegions = Object.keys(regionsToPoints).length;

console.log("Part 1 Answer:", usedSpaces);
console.log("Part 2 Answer:", numberOfRegions);
