import path from "path";
import fs from "fs";

const getSequences = (history: number[]) => {
  const initialSequence = [...history];
  const sequences: number[][] = [initialSequence];

  while (!sequences[sequences.length - 1].every((val) => val === 0)) {
    const lastSequence = sequences[sequences.length - 1];
    const newSequence: number[] = new Array(lastSequence.length - 1).fill(0);
    for (let i = 0; i < lastSequence.length - 1; i++) {
      newSequence[i] = lastSequence[i + 1] - lastSequence[i];
    }
    sequences.push(newSequence);
  }

  return sequences;
};

const extendSequences = (sequences: number[][]) => {
  sequences[sequences.length - 1].push(0);
  sequences[sequences.length - 1].unshift(0);

  for (let i = sequences.length - 2; i >= 0; i--) {
    const lowerSequence = sequences[i + 1];
    const sequenceToIncrement = sequences[i];

    sequenceToIncrement.push(
      lowerSequence[lowerSequence.length - 1] +
        sequenceToIncrement[sequenceToIncrement.length - 1]
    );
    sequenceToIncrement.unshift(sequenceToIncrement[0] - lowerSequence[0]);
  }
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const histories = data
      .split("\n")
      .map((line) => line.split(" ").map((val) => parseInt(val, 10)));

    const sequences = histories.map(getSequences);

    sequences.forEach(extendSequences);

    const newEndValues = sequences.map((sequence) => {
      const updatedHistory = sequence[0];
      return updatedHistory[updatedHistory.length - 1];
    });

    const newStartValues = sequences.map((sequence) => {
      const updatedHistory = sequence[0];
      return updatedHistory[0];
    });

    console.log(
      "Part 1 Solution -",
      newEndValues.reduce((acc, curr) => acc + curr)
    );

    console.log(
      "Part 2 Solution -",
      newStartValues.reduce((acc, curr) => acc + curr)
    );
  }
);
