import path from "path";
import fs from "fs";

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const equations = data.split("\n").map((line) => parseInput(line));
    const partOneSolution = equations.reduce((acc, equation) => {
      const allResults = processInputs(equation.inputs, false);
      return allResults.includes(equation.result) ? acc + equation.result : acc;
    }, 0);
    const partTwoSolution = equations.reduce((acc, equation) => {
      const allResults = processInputs(equation.inputs, true);
      return allResults.includes(equation.result) ? acc + equation.result : acc;
    }, 0);

    console.log("Part 1 Solution - ", partOneSolution);
    console.log("Part 2 Solution - ", partTwoSolution);
  }
);

interface Equation {
  result: number;
  inputs: number[];
}

const parseInput = (input: string): Equation => {
  const [resultString, inputsString] = input.split(": ");
  const result = parseInt(resultString, 10);
  const inputs = inputsString.split(" ").map((n) => parseInt(n, 10));
  return { result, inputs };
};

const processInputs = (inputs: number[], isPart2: boolean): number[] => {
  if (inputs.length === 1) return inputs;
  const results: number[] = [];
  const addInput = [inputs[0] + inputs[1], ...inputs.slice(2)];
  const multiplyInput = [inputs[0] * inputs[1], ...inputs.slice(2)];

  results.push(...processInputs(addInput, isPart2));
  results.push(...processInputs(multiplyInput, isPart2));

  if (isPart2) {
    const concatenationInput = [
      parseInt(inputs[0].toString() + inputs[1].toString(), 10),
      ...inputs.slice(2),
    ];
    results.push(...processInputs(concatenationInput, isPart2));
  }

  return results;
};
