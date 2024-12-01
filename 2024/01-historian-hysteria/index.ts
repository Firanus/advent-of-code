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

    const left: number[] = [];
    const right: number[] = [];

    const lines = data.split("\n");
    lines.forEach((line) => {
        const [l, r] = line.split('   ');
        left.push(parseInt(l, 10));
        right.push(parseInt(r, 10));
    })

    left.sort();
    right.sort();

    const part1Solution = left.reduce((acc, curr, i) =>
        acc + (Math.abs(curr - right[i]))
    , 0)
    
    console.log("Part 1 Solution - ", part1Solution);

    const rightListMap = right.reduce<{[key: number]: number}>((acc, curr) => {
        if (acc[curr]) {
            acc[curr] += 1;
        } else {
            acc[curr] = 1;
        }
        return acc;
    }, {})
    const part2Rolution = left.reduce((acc, curr) => acc + (curr * (rightListMap[curr] ?? 0)), 0)
    console.log("Part 2 Solution - ", part2Rolution);
  }
);
