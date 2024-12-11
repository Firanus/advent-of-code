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

    const map = data.split("\n").map((row) => row.split("").map(x => parseInt(x, 10)));
    const trailheads = map.reduce<{ x: number, y: number }[]>((acc, row, y) => {
        row.forEach((height, x) => {
            if (height === 0) {
                acc.push({ x, y });
            }
        });
        return acc;
    }, []);

    const partOneSolution = trailheads.map(trailhead => findPathsToTop(map, trailhead, true)).reduce((a, b) => a + b, 0,);
    const partTwoSolution = trailheads.map(trailhead => findPathsToTop(map, trailhead, false)).reduce((a, b) => a + b, 0);

    console.log("Part 1 Solution - ", partOneSolution);
    console.log("Part 2 Solution - ", partTwoSolution);
  }
);

const findPathsToTop = (map: number[][], trailhead: { x: number, y: number }, isPartOne: boolean) => {
  const visited = new Set<string>();
  const queue = [{ x: trailhead.x, y: trailhead.y, distance: 0 }];
  let pathCount = 0;
  while (queue.length > 0) {
    const { x, y, distance } = queue.shift()!;
    const currentHeight = map[y][x];
    if (currentHeight === 9) {
      pathCount++;
      continue;
    }

    const neighbors = getNeighbors(x, y, distance, map);
    neighbors.forEach((neighbor) => {
      const neighborHeight = map[neighbor.y][neighbor.x];
      if (neighborHeight !== currentHeight + 1) return;
      if (visited.has(`${neighbor.x},${neighbor.y}`)) return;
  
      if (isPartOne) {
        visited.add(`${neighbor.x},${neighbor.y}`);
      }
      queue.push(neighbor);
    });
  }
  return pathCount;
};

const getNeighbors = (x: number, y: number, distance: number, map: number[][]) => {
  const neighbors: { x: number, y: number, distance: number }[] = [];
  if (x > 0) neighbors.push({ x: x - 1, y, distance: distance + 1 });
  if (x < map[0].length - 1) neighbors.push({ x: x + 1, y, distance: distance + 1 });
  if (y > 0) neighbors.push({ x, y: y - 1, distance: distance + 1 });
  if (y < map.length - 1) neighbors.push({ x, y: y + 1, distance: distance + 1 });
  return neighbors;
};
