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

    const matches = data.match(/(mul\(\d*,\d*\)|do\(\)|don't\(\))/g);
    const partOneSolution = matches?.reduce((acc, match) => {
      if (match === "do()" || match === "don't()") return acc;
      const [a, b] = match
        .replace("mul(", "")
        .replace(")", "")
        .split(",")
        .map((n) => parseInt(n, 10));
      return acc + a * b;
    }, 0);

    let enabled = true;
    const partTwoSolution = matches?.reduce((acc, match) => {
      if (match === "do()") {
        enabled = true;
        return acc;
      }
      if (match === "don't()") {
        enabled = false;
        return acc;
      }
      if (!enabled) return acc;
      const [a, b] = match
        .replace("mul(", "")
        .replace(")", "")
        .split(",")
        .map((n) => parseInt(n, 10));
      return acc + a * b;
    }, 0);

    console.log("Part 1 Solution - ", partOneSolution);
    console.log("Part 2 Solution - ", partTwoSolution);
  }
);
