import { readParameter } from "../../parameters";
import { Parameter } from "../../parameters/types";

// Parameter[0] is a read parameter
// Parameter[1] is a write parameter

export default (
  memory: number[],
  parameters: [Parameter, Parameter]
): number | undefined => {
  const comparisonParam = readParameter(parameters[0], memory);
  const jumpAddress = readParameter(parameters[1], memory);

  return comparisonParam !== 0 ? jumpAddress : undefined;
};
