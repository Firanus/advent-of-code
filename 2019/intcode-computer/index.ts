import { processInstructionCode } from "./instructionCode";
import { executeOperation, getOperation } from "./operations";
import { getParametersForOperation } from "./parameters";

interface ComputerOutput {
  memory: number[];
  outputStream: number[];
}

export const runIntcodeComputerProgram = async (
  initialMemory: number[],
  inputStream: number[] = []
): Promise<ComputerOutput> => {
  let instructionPointer = 0;

  let shouldContinueProgramExecution = true;
  let memory = [...initialMemory];
  const outputStream: number[] = [];

  while (shouldContinueProgramExecution) {
    const { nextPointer, shouldContinueExecuting } = await performNextOperation(
      {
        memory,
        currentPointer: instructionPointer,
        inputStream,
        outputStream,
      }
    );
    instructionPointer = nextPointer;
    shouldContinueProgramExecution = shouldContinueExecuting;
  }

  return { memory, outputStream };
};

const performNextOperation = async ({
  memory,
  currentPointer,
  inputStream,
  outputStream,
}: {
  memory: number[];
  currentPointer: number;
  inputStream: number[];
  outputStream: number[];
}): Promise<{ shouldContinueExecuting: boolean; nextPointer: number }> => {
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
      inputStream,
      outputStream,
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
