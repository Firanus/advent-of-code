import path from "path";
import fs from "fs";

const digitToNum = (digit: string): number => {
  if (digit === "-") return -1;
  if (digit === "=") return -2;
  return parseInt(digit);
};

const numToDigit = (num: number): { digit: string; carries: boolean } => {
  if (num === 3) return { digit: "=", carries: true };
  if (num === 4) return { digit: "-", carries: true };
  if (num === 5) return { digit: "0", carries: true };
  return { digit: num.toString(10), carries: false };
};

const fromSnafuNumber = (str: string): number => {
  const revStr = str.split("").reverse();

  let result = 0;
  for (let i = 0; i < revStr.length; i++) {
    const powOfFive = i;
    const digit = revStr[i];
    result += digitToNum(digit) * Math.pow(5, powOfFive);
  }
  return result;
};

const toSnafuNumber = (num: number): string => {
  const numInBase5 = num.toString(5);
  const baseFiveRev = numInBase5
    .split("")
    .reverse()
    .map((x) => parseInt(x, 10));
  let carries: boolean = false;
  const result: string[] = [];
  for (let i = 0; i < baseFiveRev.length; i++) {
    const { digit, carries: newCarries } = numToDigit(
      baseFiveRev[i] + (carries ? 1 : 0)
    );
    carries = newCarries;
    result.push(digit);
  }
  if (carries) {
    result.push("1");
  }

  return result.reverse().join("");
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const sum = data
      .split("\n")
      .map(fromSnafuNumber)
      .reduce((acc, curr) => acc + curr, 0);

    console.log("Solution:", toSnafuNumber(sum));
  }
);
