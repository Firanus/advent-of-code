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

    // Part 1 = Prepare for 1202 program alarm state
    let noun = 12;
    let verb = 2;

    initialMemory[1] = noun;
    initialMemory[2] = verb;

    const { memory: returnedMemory } = await runIntcodeComputerProgram(
      initialMemory
    );
    const [output] = returnedMemory;

    console.log("Part 1 Solution", output);

    const targetValue = 19690720;
    for (noun = 0; noun < 100; noun++) {
      for (verb = 0; verb < 100; verb++) {
        const memory = [...initialMemory];
        memory[1] = noun;
        memory[2] = verb;
        const { memory: returnedMemory } = await runIntcodeComputerProgram(
          memory
        );
        const [output] = returnedMemory;

        if (output === targetValue) {
          console.log("Part 2 Solution", 100 * noun + verb);
          return;
        }
      }
    }
  }
);
