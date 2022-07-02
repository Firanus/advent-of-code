import readline from "readline";

import { getWriteAddress } from "../../parameters";
import { Parameter } from "../../parameters/types";

// Parameter[0] is a write parameter

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const requestInput = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    readlineInterface.question("Enter an integer as input: ", (answer) => {
      const integer = parseInt(answer, 10);
      if (Number.isNaN(integer)) {
        reject("You have not entered an integer as input");
      }

      resolve(integer);
    });
  });
};

export default async (memory: number[], parameters: [Parameter]) => {
  const writeAddress = getWriteAddress(parameters[0], memory);

  const inputValue = await requestInput();

  memory[writeAddress] = inputValue;
};
