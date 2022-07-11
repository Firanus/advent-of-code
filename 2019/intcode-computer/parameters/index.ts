import { getParameterCountForOperation } from "../operations";
import { Operation } from "../operations/types";
import { ParameterMode, Parameter } from "./types";

const getSingleParameterMode = (paramCode: number): ParameterMode => {
  switch (paramCode) {
    case 0:
      return ParameterMode.Position;
    case 1:
      return ParameterMode.Immediate;
    case 2:
      return ParameterMode.Relative;
    default:
      throw new Error(`Unknown Parameter Mode ${paramCode}`);
  }
};

export const getParametersForOperation = ({
  parameterCodes,
  operation,
  instructionPointer,
  relativeBase,
}: {
  parameterCodes: number[];
  operation: Operation;
  instructionPointer: number;
  relativeBase: number;
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
      relativeBase,
    });
  }

  return parameters;
};

export const getWriteAddress = (
  parameter: Parameter,
  memory: number[]
): number => {
  return parameter.mode === ParameterMode.Relative
    ? memory[parameter.address] + parameter.relativeBase
    : memory[parameter.address];
};

export const readParameter = (
  parameter: Parameter,
  memory: number[]
): number => {
  switch (parameter.mode) {
    case ParameterMode.Immediate:
      return memory[parameter.address] ?? 0;
    case ParameterMode.Position: {
      const addressOfValue = memory[parameter.address];
      return memory[addressOfValue] ?? 0;
    }
    case ParameterMode.Relative: {
      const addressOfValue = memory[parameter.address] + parameter.relativeBase;
      return memory[addressOfValue] ?? 0;
    }
    default:
      throw new Error(`Unknown Parameter Mode ${parameter.mode}`);
  }
};
