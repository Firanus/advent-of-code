export const runIntcodeComputerProgram = (
  initialMemory: number[]
): number[] => {
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
