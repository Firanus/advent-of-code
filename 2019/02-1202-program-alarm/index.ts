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

    const memoryForPart1 = [...initialMemory];

    // Part 1 = Prepare for 1202 program alarm state
    let noun = 12;
    let verb = 2;

    memoryForPart1[1] = noun;
    memoryForPart1[2] = verb;

    const computer = new IntcodeComputer(memoryForPart1);
    computer.run();
    const [output] = computer.viewMemory();

    console.log("Part 1 Solution", output);

    const targetValue = 19690720;
    for (noun = 0; noun < 100; noun++) {
      for (verb = 0; verb < 100; verb++) {
        const memory = [...initialMemory];
        memory[1] = noun;
        memory[2] = verb;

        const computer = new IntcodeComputer(memory);
        computer.run();
        const [output] = computer.viewMemory();

        if (output === targetValue) {
          console.log("Part 2 Solution", 100 * noun + verb);
          return;
        }
      }
    }
  }
);
