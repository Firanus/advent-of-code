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

    await runIntcodeComputerProgram(memory);
  }
);
