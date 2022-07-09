import path from "path";
import fs from "fs";

import { runIntcodeComputerProgram } from "../intcode-computer";

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const initialMemory: number[] = data.split(",").map((x) => parseInt(x, 10));

    const memory = [...initialMemory];

    // Part 1
    const { outputStream: part1OutputStream } = await runIntcodeComputerProgram(
      memory,
      [1]
    );
    part1OutputStream.map((outputValue, index) =>
      index < part1OutputStream.length - 1
        ? console.log("Diagnostic Code:", outputValue)
        : console.log("Part 1 Answer: ", outputValue)
    );

    // Part 2
    const { outputStream: part2OutputStream } = await runIntcodeComputerProgram(
      memory,
      [5]
    );
    part2OutputStream.map((outputValue) =>
      console.log("Part 2 Answer: ", outputValue)
    );
  }
);
