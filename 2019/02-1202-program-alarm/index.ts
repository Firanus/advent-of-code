import path from "path";
import fs from "fs";

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
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

  const [output] = runProgram(initialMemory);

  console.log("Part 1 Solution", output);

  const targetValue = 19690720;
  for (noun = 0; noun < 100; noun++) {
    for (verb = 0; verb < 100; verb++) {
      const memory = [...initialMemory];
      memory[1] = noun;
      memory[2] = verb;
      const [output] = runProgram(memory);

      if (output === targetValue) {
        console.log("Part 2 Solution", 100 * noun + verb);
        return;
      }
    }
  }
});

const runProgram = (initialMemory: number[]): number[] => {
  let instructionPointer = 0;

  let shouldContinueProgramExecution = true;
  let memory = [...initialMemory];

  while (shouldContinueProgramExecution) {
    const opCode = memory[instructionPointer];
    const parameters = getInstructionParameters(
      memory,
      instructionPointer,
      opCode
    );
    const { shouldContinueProgram } = processInstruction(
      memory,
      opCode,
      parameters
    );
    shouldContinueProgramExecution = shouldContinueProgram;

    const instructionSize = 1 + parameters.length;
    instructionPointer += instructionSize;
  }

  return memory;
};

const getInstructionParameters = (
  memory: number[],
  instructionPointer: number,
  opCode: number
): number[] => {
  switch (opCode) {
    case 1:
    case 2:
      return [
        memory[instructionPointer + 1],
        memory[instructionPointer + 2],
        memory[instructionPointer + 3],
      ];
    case 99:
    default:
      return [];
  }
};

const processInstruction = (
  memory: number[],
  opCode: number,
  parameters: number[]
): { shouldContinueProgram: boolean } => {
  switch (opCode) {
    case 1:
      handleAddition(memory, parameters);
      return { shouldContinueProgram: true };
    case 2:
      handleMultiplication(memory, parameters);
      return { shouldContinueProgram: true };
    case 99:
      return { shouldContinueProgram: false };
    default:
      throw new Error(`Unknown opcode ${opCode} encountered`);
  }
};

const handleAddition = (memory: number[], parameters: number[]) => {
  const sourceAddresses = parameters.slice(0, -1);
  const resultAddress = parameters[parameters.length - 1];

  const numbersToSum = sourceAddresses.map((addr) => memory[addr]);
  const result = numbersToSum.reduce((acc, curr) => acc + curr, 0);

  memory[resultAddress] = result;
};

const handleMultiplication = (memory: number[], parameters: number[]) => {
  const sourceAddresses = parameters.slice(0, -1);
  const resultAddress = parameters[parameters.length - 1];

  const numbersToSum = sourceAddresses.map((addr) => memory[addr]);
  const result = numbersToSum.reduce((acc, curr) => acc * curr, 1);

  memory[resultAddress] = result;
};
