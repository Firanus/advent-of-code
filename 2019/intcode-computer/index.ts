import { processInstructionCode } from "./instructionCode";
import { executeOperation, getOperation } from "./operations";
import { getParametersForOperation } from "./parameters";

export const runIntcodeComputerProgram = async (
  initialMemory: number[]
): Promise<number[]> => {
  let instructionPointer = 0;

  let shouldContinueProgramExecution = true;
  let memory = [...initialMemory];

  while (shouldContinueProgramExecution) {
    const { nextPointer, shouldContinueExecuting } = await performNextOperation(
      memory,
      instructionPointer
    );
    instructionPointer = nextPointer;
    shouldContinueProgramExecution = shouldContinueExecuting;
  }

  return memory;
};

const performNextOperation = async (
  memory: number[],
  currentPointer: number
): Promise<{ shouldContinueExecuting: boolean; nextPointer: number }> => {
  const instructionCode = memory[currentPointer];
  const { opCode, parameterCodes } = processInstructionCode(instructionCode);

  const operation = getOperation(opCode);

  const parameters = getParametersForOperation({
    operation,
    parameterCodes,
    instructionPointer: currentPointer,
  });
  const { shouldContinueExecuting, newInstructionPointerValue } =
    await executeOperation({
      memory,
      operation,
      parameters,
    });

  const nextPointer =
    newInstructionPointerValue !== undefined
      ? newInstructionPointerValue
      : currentPointer + 1 + parameters.length;
  return {
    shouldContinueExecuting,
    nextPointer,
  };
};
