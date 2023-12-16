import path from "path";
import fs from "fs";

interface StepInstruction {
  label: string;
  operation: "-" | "=";
  operationTarget: number | undefined;
  boxNumber: number;
  initScore: number;
}

const runHashMapAlgorithm = (init: number, newChar: string): number => {
  return ((init + newChar.charCodeAt(0)) * 17) % 256;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const stepInstructions: StepInstruction[] = data.split(",").map((step) => {
      const [label, operationTarget] = step.split("=");
      const initScore = step
        .split("")
        .reduce((acc, char) => runHashMapAlgorithm(acc, char), 0);
      if (operationTarget) {
        const boxNumber = label
          .split("")
          .reduce((acc, char) => runHashMapAlgorithm(acc, char), 0);
        return {
          label,
          operation: "=",
          operationTarget: parseInt(operationTarget, 10),
          boxNumber,
          initScore,
        };
      }

      const boxNumber = label
        .slice(0, label.length - 1)
        .split("")
        .reduce((acc, char) => runHashMapAlgorithm(acc, char), 0);
      return {
        label: label.slice(0, label.length - 1),
        operation: "-",
        operationTarget: undefined,
        boxNumber,
        initScore,
      };
    });

    const boxes: { key: string; value: number }[][] = [];
    for (let i = 0; i < 256; i++) boxes.push([]);

    stepInstructions.forEach((step) => {
      if (step.operation === "=") {
        const box = boxes[step.boxNumber];
        const indexOfLabel = box.findIndex((b) => b.key === step.label);
        if (indexOfLabel === -1) {
          box.push({ key: step.label, value: step.operationTarget! });
        } else {
          box[indexOfLabel].value = step.operationTarget!;
        }
      } else {
        boxes[step.boxNumber] = boxes[step.boxNumber].filter(
          (b) => b.key !== step.label
        );
      }
    });

    const focusingPowersInBoxes = boxes.map((box, index) => {
      return box.reduce(
        (acc, curr, boxIndex) =>
          acc + (index + 1) * (boxIndex + 1) * curr.value,
        0
      );
    });

    console.log(
      "Part 1 Solution -",
      stepInstructions.reduce((acc, curr) => acc + curr.initScore, 0)
    );
    console.log(
      "Part 2 Solution -",
      focusingPowersInBoxes.reduce((acc, curr) => acc + curr, 0)
    );
  }
);
