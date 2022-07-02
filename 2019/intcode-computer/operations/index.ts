import { Parameter } from "../parameters/types";
import {
  handleAddition,
  handleInput,
  handleMultiplication,
  handleOutput,
} from "./handlers";
import { Operation } from "./types";

export const getOperation = (opCode: number): Operation => {
  switch (opCode) {
    case 1:
      return Operation.Addition;
    case 2:
      return Operation.Multiplication;
    case 3:
      return Operation.Input;
    case 4:
      return Operation.Output;
    case 99:
      return Operation.FinishProgram;
    default:
      throw new Error(`Unknown operation ${opCode}`);
  }
};

export const getParameterCountForOperation = (operation: Operation): number => {
  switch (operation) {
    case Operation.Addition:
    case Operation.Multiplication:
      return 3;
    case Operation.Input:
    case Operation.Output:
      return 1;
    case Operation.FinishProgram:
      return 0;
  }
};

export const executeOperation = async ({
  memory,
  operation,
  parameters,
}: {
  memory: number[];
  operation: Operation;
  parameters: Parameter[];
}): Promise<{ shouldContinueExecuting: boolean }> => {
  switch (operation) {
    case Operation.Addition:
      handleAddition(memory, parameters as [Parameter, Parameter, Parameter]);
      return { shouldContinueExecuting: true };
    case Operation.Multiplication:
      handleMultiplication(
        memory,
        parameters as [Parameter, Parameter, Parameter]
      );
      return { shouldContinueExecuting: true };
    case Operation.Input:
      await handleInput(memory, parameters as [Parameter]);
      return { shouldContinueExecuting: true };
    case Operation.Output:
      handleOutput(memory, parameters as [Parameter]);
      return { shouldContinueExecuting: true };
    case Operation.FinishProgram:
      return { shouldContinueExecuting: false };
    default:
      throw new Error(`Unknown operation ${operation} encountered`);
  }
};
