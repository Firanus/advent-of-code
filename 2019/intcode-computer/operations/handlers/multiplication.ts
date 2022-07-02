import { getWriteAddress, readParameter } from "../../parameters";
import { Parameter } from "../../parameters/types";

// Parameters[0] and [1] are read parameters
// Parameter[2] is a write parameter

export default (
  memory: number[],
  parameters: [Parameter, Parameter, Parameter]
) => {
  const resultAddress = getWriteAddress(parameters[2], memory);

  const product =
    readParameter(parameters[0], memory) * readParameter(parameters[1], memory);

  memory[resultAddress] = product;
};
