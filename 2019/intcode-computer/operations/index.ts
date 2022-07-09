import { Parameter } from "../parameters/types";
import {
  handleAddition,
  handleEquals,
  handleInput,
  handleJumpIfFalse,
  handleJumpIfTrue,
  handleLessThan,
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
    case 5:
      return Operation.JumpIfTrue;
    case 6:
      return Operation.JumpIfFalse;
    case 7:
      return Operation.LessThan;
    case 8:
      return Operation.Equals;
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
    case Operation.LessThan:
    case Operation.Equals:
      return 3;
    case Operation.JumpIfTrue:
    case Operation.JumpIfFalse:
      return 2;
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
  inputStream,
  outputStream,
}: {
  memory: number[];
  operation: Operation;
  parameters: Parameter[];
  inputStream: number[];
  outputStream: number[];
}): Promise<{
  shouldContinueExecuting: boolean;
  newInstructionPointerValue?: number;
}> => {
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
      await handleInput(memory, parameters as [Parameter], inputStream);
      return { shouldContinueExecuting: true };
    case Operation.Output:
      handleOutput(memory, parameters as [Parameter], outputStream);
      return { shouldContinueExecuting: true };
    case Operation.JumpIfTrue: {
      const newInstructionPointerValue = handleJumpIfTrue(
        memory,
        parameters as [Parameter, Parameter]
      );
      return { shouldContinueExecuting: true, newInstructionPointerValue };
    }
    case Operation.JumpIfFalse: {
      const newInstructionPointerValue = handleJumpIfFalse(
        memory,
        parameters as [Parameter, Parameter]
      );
      return { shouldContinueExecuting: true, newInstructionPointerValue };
    }
    case Operation.LessThan:
      handleLessThan(memory, parameters as [Parameter, Parameter, Parameter]);
      return { shouldContinueExecuting: true };
    case Operation.Equals:
      handleEquals(memory, parameters as [Parameter, Parameter, Parameter]);
      return { shouldContinueExecuting: true };
    case Operation.FinishProgram:
      return { shouldContinueExecuting: false };
    default:
      throw new Error(`Unknown operation ${operation} encountered`);
  }
};
