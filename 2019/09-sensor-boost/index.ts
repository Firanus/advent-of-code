import path from "path";
import fs from "fs";

import { IntcodeComputer } from "../intcode-computer";

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const initialMemory: number[] = data.split(",").map((x) => parseInt(x, 10));

    const part1Computer = new IntcodeComputer(initialMemory);
    part1Computer.pushToInputStream(1);
    part1Computer.run();
    console.log("Part 1 Answer:", part1Computer.pullFromOutputStream());

    const part2Computer = new IntcodeComputer(initialMemory);
    part2Computer.pushToInputStream(2);
    part2Computer.run();
    console.log("Part 2 Answer:", part2Computer.pullFromOutputStream());
  }
);
