import { getParameterCountForOperation } from "../operations";
import { Operation } from "../operations/types";
import { ParameterMode, Parameter } from "./types";

const getSingleParameterMode = (paramCode: number): ParameterMode => {
  switch (paramCode) {
    case 0:
      return ParameterMode.Position;
    case 1:
      return ParameterMode.Immediate;
    default:
      throw new Error(`Unknown Parameter Mode ${paramCode}`);
  }
};

export const getParametersForOperation = ({
  parameterCodes,
  operation,
  instructionPointer,
}: {
  parameterCodes: number[];
  operation: Operation;
  instructionPointer: number;
}): Parameter[] => {
  const expectedParameterCount = getParameterCountForOperation(operation);

  const parameters: Parameter[] = [];
  for (let i = 0; i < expectedParameterCount; i++) {
    const providedParamCode = parameterCodes[i];
    const parameterMode = getSingleParameterMode(
      providedParamCode !== undefined ? providedParamCode : 0
    );

    parameters.push({
      mode: parameterMode,
      address: instructionPointer + 1 + i,
    });
  }

  return parameters;
};

export const getWriteAddress = (
  parameter: Parameter,
  memory: number[]
): number => {
  return memory[parameter.address];
};

export const readParameter = (
  parameter: Parameter,
  memory: number[]
): number => {
  switch (parameter.mode) {
    case ParameterMode.Immediate:
      return memory[parameter.address];
    case ParameterMode.Position: {
      const addressOfValue = memory[parameter.address];
      return memory[addressOfValue];
    }
    default:
      throw new Error(`Unknown Parameter Mode ${parameter.mode}`);
  }
};
