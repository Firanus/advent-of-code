import { getWriteAddress } from "../../parameters";
import { Parameter } from "../../parameters/types";

// Parameter[0] is a write parameter

export default (
  memory: number[],
  parameters: [Parameter],
  inputStream: number[]
): { requiresInput: boolean } => {
  const writeAddress = getWriteAddress(parameters[0], memory);

  if (inputStream.length === 0) {
    return { requiresInput: true };
  }

  let inputValue: number;
  inputValue = inputStream.shift()!;
  memory[writeAddress] = inputValue;
  return { requiresInput: false };
};
