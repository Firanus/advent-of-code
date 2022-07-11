import { processInstructionCode } from "./instructionCode";
import { executeOperation, getOperation } from "./operations";
import { getParametersForOperation } from "./parameters";
import { ComputerStatus } from "./types";

export class IntcodeComputer {
  status: ComputerStatus = "NOT_STARTED";
  private memory: number[];
  private inputStream: number[] = [];
  private outputStream: number[] = [];
  private instructionPointer: number = 0;
  private relativeBase: number = 0;

  constructor(initialMemory: number[]) {
    this.memory = initialMemory;
  }

  pushToInputStream(input: number) {
    this.inputStream.push(input);
  }

  getSizeOfOutputStream() {
    return this.outputStream.length;
  }

  pullFromOutputStream() {
    return this.outputStream.shift();
  }

  viewOutputStream() {
    return [...this.outputStream];
  }

  viewMemory(): number[] {
    return [...this.memory];
  }

  run() {
    this.status = "RUNNING";
    while (this.status === "RUNNING") {
      const { nextPointer, newComputerStatus, relativeBaseAdjustment } =
        performNextOperation({
          memory: this.memory,
          currentPointer: this.instructionPointer,
          inputStream: this.inputStream,
          outputStream: this.outputStream,
          relativeBase: this.relativeBase,
        });

      if (newComputerStatus) {
        this.status = newComputerStatus;
      } else {
        this.instructionPointer = nextPointer;
        this.relativeBase += relativeBaseAdjustment;
      }
    }
  }
}

const performNextOperation = ({
  memory,
  currentPointer,
  inputStream,
  outputStream,
  relativeBase,
}: {
  memory: number[];
  currentPointer: number;
  inputStream: number[];
  outputStream: number[];
  relativeBase: number;
}): {
  newComputerStatus?: ComputerStatus;
  nextPointer: number;
  relativeBaseAdjustment: number;
} => {
  const instructionCode = memory[currentPointer];
  const { opCode, parameterCodes } = processInstructionCode(instructionCode);

  const operation = getOperation(opCode);

  const parameters = getParametersForOperation({
    operation,
    parameterCodes,
    instructionPointer: currentPointer,
    relativeBase,
  });
  const {
    newComputerStatus,
    newInstructionPointerValue,
    relativeBaseAdjustment,
  } = executeOperation({
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
    newComputerStatus,
    nextPointer,
    relativeBaseAdjustment: relativeBaseAdjustment ?? 0,
  };
};
