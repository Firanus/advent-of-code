import path from "path";
import fs from "fs";

import { runIntcodeComputerProgram } from "../intcode-computer";

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const initialMemory: number[] = data.split(",").map((x) => parseInt(x, 10));
    const amplifierCount = 5;

    const allPossibleAmplificationPhaseSettings: number[][] =
      generateAllPermutations([...Array(amplifierCount).keys()]);

    const results: { amplificationSetting: number[]; signal: number }[] = [];
    for (let i = 0; i < allPossibleAmplificationPhaseSettings.length; i++) {
      const currentAmplificationPhaseSetting = [
        ...allPossibleAmplificationPhaseSettings[i],
      ];
      let inputSignal = 0;
      for (let j = 0; j < amplifierCount; j++) {
        const memory = [...initialMemory];
        const inputStream = [
          currentAmplificationPhaseSetting.shift()!,
          inputSignal,
        ];
        const { outputStream } = await runIntcodeComputerProgram(
          memory,
          inputStream
        );
        inputSignal = outputStream[0]!;
      }
      results.push({
        amplificationSetting: allPossibleAmplificationPhaseSettings[i],
        signal: inputSignal,
      });
    }

    const bestResult = results.reduce(
      (acc, curr) => (curr.signal > acc.signal ? curr : acc),
      results[0]
    );
    console.log(bestResult);
  }
);

// Heap's Algorithm for generating permutations.
// http://ruslanledesma.com/2016/06/17/why-does-heap-work.html
const generateAllPermutations = (initialPermutation: number[]): number[][] => {
  const sequence = initialPermutation;
  const length = sequence.length;

  let result: number[][] = [[...sequence]];

  const swap = (array: any[], indexOne: number, indexTwo: number) => {
    const temp = array[indexOne];
    array[indexOne] = array[indexTwo];
    array[indexTwo] = temp;
  };

  const heapsAlgorithmForPermutations = (sequence: any[], n: number) => {
    if (n === 1) {
      return;
    }

    heapsAlgorithmForPermutations(sequence, n - 1);

    for (let i = 0; i < n - 1; i++) {
      if (n % 2 === 0) {
        swap(sequence, i, n - 1);
      } else {
        swap(sequence, 0, n - 1);
      }
      result.push([...sequence]);
      heapsAlgorithmForPermutations(sequence, n - 1);
    }
  };

  heapsAlgorithmForPermutations(sequence, length);
  return result;
};
