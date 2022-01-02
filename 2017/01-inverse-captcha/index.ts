import path from "path";
import fs from "fs";

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const captcha: string[] = data.split("");
  const solutions = captcha.reduce(
    (acc, curr, index, array) => {
      const pOneComparisonIndex = index === captcha.length - 1 ? 0 : index + 1;
      const pTwoComparisonIndex = (index + captcha.length / 2) % captcha.length;
      const pOneComparisonValue = array[pOneComparisonIndex];
      const pTwoComparisonValue = array[pTwoComparisonIndex];

      if (curr === pOneComparisonValue) {
        acc.partOneSolution += parseInt(curr);
      }

      if (curr === pTwoComparisonValue) {
        acc.partTwoSolution += parseInt(curr);
      }

      return acc;
    },
    { partOneSolution: 0, partTwoSolution: 0 }
  );

  console.log("Part 1 solution:", solutions.partOneSolution);
  console.log("Part 2 solution:", solutions.partTwoSolution);
});
