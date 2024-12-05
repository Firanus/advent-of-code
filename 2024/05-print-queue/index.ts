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

    const [rules, printings] = data.split("\n\n");
    const printQueue = printings
      .split("\n")
      .map((s) => s.split(",").map((p) => parseInt(p, 10)));

    // Each rule specifies the numbers which must appear after the key.
    const rulesMap = rules
      .split("\n")
      .reduce<{ [key: number]: number[] }>((acc, rule) => {
        const [before, after] = rule.split("|").map((r) => parseInt(r, 10));

        if (acc[before]) {
          acc[before].push(after);
        } else {
          acc[before] = [after];
        }
        return acc;
      }, {});

    const validPrintings = printQueue.filter((p) =>
      isValidPrinting(p, rulesMap)
    );

    const partOneSolution = validPrintings.reduce((acc, p) => {
      const middleDigit = p[(p.length - 1) / 2]; // Assumes all arrays are of odd length.
      return acc + middleDigit;
    }, 0);

    const invalidPrintings = printQueue.filter(
      (p) => !isValidPrinting(p, rulesMap)
    );

    const fixedPrintings = invalidPrintings.map((p) =>
      fixPrinting(p, rulesMap)
    );

    const partTwoSolution = fixedPrintings.reduce((acc, p) => {
      const middleDigit = p[(p.length - 1) / 2]; // Assumes all arrays are of odd length.
      return acc + middleDigit;
    }, 0);

    console.log("Part 1 Solution - ", partOneSolution);
    console.log("Part 2 Solution - ", partTwoSolution);
  }
);

const isValidPrinting = (
  p: number[],
  rulesMap: { [key: number]: number[] }
): boolean => {
  for (let i = 0; i < p.length; i++) {
    const curr = p[i];
    const alreadyPrinted = p.slice(0, i);
    const itemsWhichMustAppearAfterCurr = rulesMap[curr] ?? [];

    if (
      alreadyPrinted.some((ap) => itemsWhichMustAppearAfterCurr.includes(ap))
    ) {
      return false;
    }
  }
  return true;
};

interface PositionOrdering {
  value: number;
  mustAppearAfter: number[];
}
const fixPrinting = (
  p: number[],
  rulesMap: { [key: number]: number[] }
): number[] => {
  const positionOrderings = p.map<PositionOrdering>((value) => {
    const mustAppearAfter = rulesMap[value]?.filter((x) => p.includes(x)) ?? [];
    return { value, mustAppearAfter };
  });

  const result = positionOrderings
    .sort((a, b) => b.mustAppearAfter.length - a.mustAppearAfter.length)
    .map((po) => po.value);
  return result;
};
