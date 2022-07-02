import { processInstructionCode } from "./instructionCode";
import { executeOperation, getOperation } from "./operations";
import { getParametersForOperation } from "./parameters";

export const runIntcodeComputerProgram = (
  initialMemory: number[]
): number[] => {
  let instructionPointer = 0;

  let shouldContinueProgramExecution = true;
  let memory = [...initialMemory];

  while (shouldContinueProgramExecution) {
    const { nextPointer, shouldContinueExecuting } = performNextOperation(
      memory,
      instructionPointer
    );
    instructionPointer = nextPointer;
    shouldContinueProgramExecution = shouldContinueExecuting;
  }

  return memory;
};

const performNextOperation = (
  memory: number[],
  currentPointer: number
): { shouldContinueExecuting: boolean; nextPointer: number } => {
  const instructionCode = memory[currentPointer];
  const { opCode, parameterCodes } = processInstructionCode(instructionCode);

  const operation = getOperation(opCode);

  const parameters = getParametersForOperation({
    operation,
    parameterCodes,
    instructionPointer: currentPointer,
  });
  const { shouldContinueExecuting } = executeOperation({
    memory,
    operation,
    parameters,
  });

  return {
    shouldContinueExecuting,
    nextPointer: currentPointer + 1 + parameters.length,
  };
};
