import { getWriteAddress, readParameter } from "../../parameters";
import { Parameter } from "../../parameters/types";

// Parameter[0] is a read parameter
// Parameter[1] is a read parameter
// Parameter[2] is a write parameter

export default (
  memory: number[],
  parameters: [Parameter, Parameter, Parameter]
) => {
  const resultAddress = getWriteAddress(parameters[2], memory);

  const sum =
    readParameter(parameters[0], memory) + readParameter(parameters[1], memory);

  memory[resultAddress] = sum;
};
