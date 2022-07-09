import { readParameter } from "../../parameters";
import { Parameter } from "../../parameters/types";

// Parameter[0] is a read parameter

export default (
  memory: number[],
  parameters: [Parameter],
  outputStream: number[]
) => {
  const outputValue = readParameter(parameters[0], memory);
  outputStream.push(outputValue);
};
