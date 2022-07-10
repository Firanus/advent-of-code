import path from "path";
import fs from "fs";

import { IntcodeComputer } from "../intcode-computer";

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const initialMemory: number[] = data.split(",").map((x) => parseInt(x, 10));

    const part1Result = findBestPhaseSetting([0, 1, 2, 3, 4], initialMemory);
    const part2Result = findBestPhaseSetting([5, 6, 7, 8, 9], initialMemory);

    console.log("Part 1 Result:", part1Result.signal);
    console.log("Part 2 Result:", part2Result.signal);
  }
);

interface FindPhaseSettingResult {
  amplificationSetting: number[];
  signal: number;
}

const findBestPhaseSetting = (
  initialPhaseSetting: number[],
  initialMemory: number[]
): FindPhaseSettingResult => {
  const allPossibleAmplificationPhaseSettings: number[][] =
    generateAllPermutations(initialPhaseSetting);

  const results: FindPhaseSettingResult[] = [];
  for (let i = 0; i < allPossibleAmplificationPhaseSettings.length; i++) {
    const currentAmplificationPhaseSetting = [
      ...allPossibleAmplificationPhaseSettings[i],
    ];

    let inputSignal = 0;
    let amplifierComputers: IntcodeComputer[] = [];

    for (let j = 0; j < currentAmplificationPhaseSetting.length; j++) {
      const memory = [...initialMemory];

      const computer = new IntcodeComputer(memory);
      computer.pushToInputStream(currentAmplificationPhaseSetting[j]);
      computer.pushToInputStream(inputSignal);
      computer.run();

      amplifierComputers[j] = computer;
      inputSignal = computer.pullFromOutputStream()!;
    }

    let currentAmplifierIndex = 0;
    while (amplifierComputers[currentAmplifierIndex].status !== "FINISHED") {
      amplifierComputers[currentAmplifierIndex].pushToInputStream(inputSignal);
      amplifierComputers[currentAmplifierIndex].run();

      inputSignal =
        amplifierComputers[currentAmplifierIndex].pullFromOutputStream()!;
      currentAmplifierIndex =
        (currentAmplifierIndex + 1) % initialPhaseSetting.length;
    }

    results.push({
      amplificationSetting: currentAmplificationPhaseSetting,
      signal: inputSignal,
    });
  }

  const bestResult = results.reduce(
    (acc, curr) => (curr.signal > acc.signal ? curr : acc),
    results[0]
  );

  return bestResult;
};

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
