import path from "path";
import fs from "fs";

interface Instruction {
  originStackIndex: number;
  endingStackIndex: number;
  cratesToMove: number;
}

type Stack = string[];

fs.readFile(
  path.resolve(__dirname, "../input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const [stackInput, instructionInput] = data.split("\n\n");
    const instructions: Instruction[] = instructionInput
      .split("\n")
      .map((s) => {
        const instructionParts = s.split(" ");
        return {
          originStackIndex: parseInt(instructionParts[3], 10),
          endingStackIndex: parseInt(instructionParts[5], 10),
          cratesToMove: parseInt(instructionParts[1], 10),
        };
      });

    const stacks: Stack[] = [[], [], [], [], [], [], [], [], []];
    stackInput.split("\n").forEach((s) => {
      const characters = s.split("");
      for (let i = 1; i < characters.length; i += 4) {
        const stackValue = characters[i];
        const isUppercaseLetter = /^[A-Z]$/.test(stackValue);
        if (!isUppercaseLetter) {
          continue;
        }
        const stackIndex = (i - 1) / 4;
        stacks[stackIndex].push(stackValue);
      }
      return [];
    });

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];
      for (let j = 0; j < instruction.cratesToMove; j++) {
        const { originStackIndex, endingStackIndex } = instruction;
        const originStack = stacks[originStackIndex - 1]; // 1-indexed vs 0-indexed
        const endingStack = stacks[endingStackIndex - 1]; // 1-indexed vs 0-indexed
        const crateToMove = originStack.shift() as string; // Assume input well-formed
        endingStack.unshift(crateToMove);
      }
    }

    const solution = stacks.map((stack) => stack[0]).join("");
    console.log("Part 1 Solution - ", solution);
  }
);
