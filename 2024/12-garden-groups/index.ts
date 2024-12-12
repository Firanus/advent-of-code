import path from "path";
import fs from "fs";

interface Point {
    x: number;
    y: number;
}

interface Region {
    id: number;
    type: string;
    cells: Point[]
}

const encode = (x: number, y: number) => `${x},${y}`;

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const map = data.split('\n').map((x) => x.split(''));
    const regions = getRegions(map);
    const partOneSolution = regions.reduce((acc, curr) => acc + curr.cells.length * getPerimeter(curr.cells), 0)
    const partTwoSolution = regions.reduce((acc, curr) => acc + curr.cells.length * getCorners(curr.cells), 0)

    console.log("Part 1 Solution - ", partOneSolution);
    console.log("Part 2 Solution - ", partTwoSolution);
  }
);

function getRegions(map: string[][]): Region[] {
    const regions: Region[] = [];
    const visited = new Set<string>();
    let regionId = 0;

    // Helper function for flood fill
    const floodFill = (x: number, y: number, type: string): Point[] => {
        const cells: Point[] = [];
        const queue: Point[] = [{x, y}];
        
        while (queue.length > 0) {
            const current = queue.shift()!;
            const key = encode(current.x, current.y);
            
            if (visited.has(key)) continue;
            if (current.x < 0 || current.x >= map[0].length) continue;
            if (current.y < 0 || current.y >= map.length) continue;
            if (map[current.y][current.x] !== type) continue;
            
            visited.add(key);
            cells.push(current);
            
            // Check all adjacent cells
            queue.push(
                {x: current.x + 1, y: current.y},
                {x: current.x - 1, y: current.y},
                {x: current.x, y: current.y + 1},
                {x: current.x, y: current.y - 1}
            );
        }
        
        return cells;
    };

    // Scan through the map
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const key = encode(x, y);
            if (visited.has(key)) continue;
            
            const type = map[y][x];
            const cells = floodFill(x, y, type);
            
            if (cells.length > 0) {
                regions.push({
                    id: regionId++,
                    type,
                    cells
                });
            }
        }
    }

    return regions;
}

function getPerimeter(cells: Point[]): number {
    let perimeterLength = 0;
    const cellSet = new Set(cells.map(c => encode(c.x, c.y)));

    // Check each cell
    for (const cell of cells) {
        // Check all adjacent positions
        const adjacent = [
            {x: cell.x + 1, y: cell.y},
            {x: cell.x - 1, y: cell.y}, 
            {x: cell.x, y: cell.y + 1},
            {x: cell.x, y: cell.y - 1}
        ];

        // Count how many sides of this cell are exposed
        for (const pos of adjacent) {
            if (!cellSet.has(encode(pos.x, pos.y))) {
                perimeterLength++;
            }
        }
    }

    return perimeterLength;
}

function getCorners(cells: Point[]): number {
    let cornerCount = 0;
    const cellSet = new Set(cells.map(c => encode(c.x, c.y)));
    
    // Check each cell
    for (const cell of cells) {
        // Check diagonal positions
        const diagonals = [
            {x: cell.x + 1, y: cell.y + 1},
            {x: cell.x + 1, y: cell.y - 1},
            {x: cell.x - 1, y: cell.y + 1},
            {x: cell.x - 1, y: cell.y - 1}
        ];

        // For each diagonal
        for (const diagonal of diagonals) {
            // Get the two adjacent cells that form the corner
            const adjacentToCorner = [
                {x: cell.x, y: diagonal.y},
                {x: diagonal.x, y: cell.y}
            ];

            // If diagonal is empty and both adjacent cells are in the set
            // this forms an outer corner
            if (!cellSet.has(encode(diagonal.x, diagonal.y)) &&
                adjacentToCorner.every(pos => cellSet.has(encode(pos.x, pos.y)))) {
                cornerCount++;
            }
            // If both adjacent cells are empty this forms an inner corner
            else if (adjacentToCorner.every(pos => !cellSet.has(encode(pos.x, pos.y)))) {
                cornerCount++;
            }
        }
    }

    return cornerCount;
}

