import { Parameter } from "../parameters/types";
import { handleAddition, handleMultiplication } from "./handlers";
import { Operation } from "./types";

export const getOperation = (opCode: number): Operation => {
  switch (opCode) {
    case 1:
      return Operation.Addition;
    case 2:
      return Operation.Multiplication;
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
    case Operation.FinishProgram:
      return 0;
  }
};

export const executeOperation = ({
  memory,
  operation,
  parameters,
}: {
  memory: number[];
  operation: Operation;
  parameters: Parameter[];
}): { shouldContinueExecuting: boolean } => {
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
    case Operation.FinishProgram:
      return { shouldContinueExecuting: false };
    default:
      throw new Error(`Unknown operation ${operation} encountered`);
  }
};
