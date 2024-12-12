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
const decode = (str: string) => str.split(',').map((x) => parseInt(x, 10));

fs.readFile(
  path.resolve(__dirname, "./testInput.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const map = data.split('\n').map((x) => x.split('').filter((x) => x !== '\r'));
    


    // console.log("Part 1 Solution - ", partOneSolution);
    // console.log("Part 2 Solution - ", partTwoSolution);
  }
);
