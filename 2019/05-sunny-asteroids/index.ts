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

    const part1Computer = new IntcodeComputer([...initialMemory]);
    part1Computer.pushToInputStream(1);
    part1Computer.run();

    while (part1Computer.getSizeOfOutputStream() > 0) {
      const outputCode = part1Computer.pullFromOutputStream();
      if (part1Computer.getSizeOfOutputStream() === 0) {
        console.log("Part 1 Answer: ", outputCode);
      } else {
        console.log("Diagnostic Code:", outputCode);
      }
    }

    // Part 2
    const part2Computer = new IntcodeComputer([...initialMemory]);
    part2Computer.pushToInputStream(5);
    part2Computer.run();

    console.log("Part 2 Answer: ", part2Computer.pullFromOutputStream());
  }
);
