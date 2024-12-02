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

    const partOneSolution = data.split("\n").reduce((acc, line) => {
      const numbers = line.split(" ").map((n) => parseInt(n, 10));
      return areSafe(numbers) ? acc + 1 : acc;
    }, 0);

    const partTwoSolution = data.split("\n").reduce((acc, line) => {
      const numbers = line.split(" ").map((n) => parseInt(n, 10));
      if (areSafe(numbers)) return acc + 1;

      return numbers.some((n, i, arr) => {
        const copy = [...arr];
        copy.splice(i, 1);
        return areSafe(copy);
      })
        ? acc + 1
        : acc;
    }, 0);

    console.log("Part 1 Solution - ", partOneSolution);
    console.log("Part 2 Solution - ", partTwoSolution);
  }
);

const areSafe = (numbers: number[]): boolean => {
  const isIncreasing = numbers[1] > numbers[0];
  return numbers.every((n, i, arr) => {
    if (i === 0) return true;
    const diff = Math.abs(n - arr[i - 1]);
    return (
      diff >= 1 && diff <= 3 && (isIncreasing ? n > arr[i - 1] : n < arr[i - 1])
    );
  });
};
