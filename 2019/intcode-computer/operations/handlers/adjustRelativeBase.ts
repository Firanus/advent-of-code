import { readParameter } from "../../parameters";
import { Parameter } from "../../parameters/types";

// Parameter[0] is a read parameter

export default (
  memory: number[],
  parameters: [Parameter]
): { relativeBaseAdjustment: number } => {
  const relativeBaseAdjustment = readParameter(parameters[0], memory);
  return { relativeBaseAdjustment };
};
