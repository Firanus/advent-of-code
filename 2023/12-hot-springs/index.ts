import path from "path";
import fs from "fs";
import { group } from "console";

const calculateExistingContiguousLengths = (group: string[]) =>
  group.reduce((acc, char, index) => {
    if (char === "#") {
      if (index > 0 && group[index - 1] === "#") {
        acc[acc.length - 1]++;
      } else {
        acc.push(1);
      }
    }

    return acc;
  }, [] as number[]);

const isFullGroupValid = (
  group: string[],
  allowedContinguousLengths: number[]
) => {
  const existingContiguousLengths = calculateExistingContiguousLengths(group);

  return (
    existingContiguousLengths.length === allowedContinguousLengths.length &&
    allowedContinguousLengths.every(
      (l, index) => l === existingContiguousLengths[index]
    )
  );
};

const isPartialGroupValid = (
  group: string[],
  allowedContinguousLengths: number[]
) => {
  const existingContiguousLengths = calculateExistingContiguousLengths(group);
  const lastGroup = existingContiguousLengths.pop(); // Remove last element as might be building group.

  const largestAllowedContiguousLength = allowedContinguousLengths.reduce(
    (a, b) => Math.max(a, b),
    0
  );

  return (
    existingContiguousLengths.every(
      (l, index) => l === allowedContinguousLengths[index]
    ) &&
    (lastGroup === undefined || lastGroup <= largestAllowedContiguousLength)
  );
};

const generateAllGroups = (
  damagedGroup: string[],
  allowedContinguousLengths: number[]
): string[][] => {
  let groups: string[][] = [[]];

  for (let i = 0; i < damagedGroup.length; i++) {
    if (damagedGroup[i] === "?") {
      groups = groups.flatMap((g) => [
        [...g, "#"],
        [...g, "."],
      ]);
    } else {
      groups = groups.map((g) => [...g, damagedGroup[i]]);
    }

    // Compress dots.
    groups = groups.map((g) =>
      g.filter((c, i) => c !== "." || (i > 0 && c !== g[i - 1]))
    );

    groups = groups.filter((g) =>
      isPartialGroupValid(g, allowedContinguousLengths)
    );
  }

  return groups;
};

const countPossibleGroups = (
  damagedGroup: string[],
  allowedContinguousLengths: number[]
): number =>
  generateAllGroups(damagedGroup, allowedContinguousLengths).filter((g) =>
    isFullGroupValid(g, allowedContinguousLengths)
  ).length;

fs.readFile(
  path.resolve(__dirname, "./testInput.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const [possibleGroupsPart1, possibleGroupsPart2] = data
      .split("\n")
      .map((row) => {
        console.log(row);
        const [damagedGroup, allowedContinguousLengthsRaw] = row.split(" ");
        const allowedContinguousLengths = allowedContinguousLengthsRaw
          .split(",")
          .map((l) => parseInt(l, 10));

        const part1 = countPossibleGroups(
          damagedGroup.split(""),
          allowedContinguousLengths
        );

        const part2 = countPossibleGroups(
          Array(5).fill(damagedGroup).join("?").split(""),
          Array(5).fill(allowedContinguousLengths).flat()
        );

        return [part1, part2];
      })
      .reduce(
        (acc, [part1, part2]) => [
          [...acc[0], part1],
          [...acc[1], part2],
        ],
        [[], []] as number[][]
      );

    console.log(possibleGroupsPart1, possibleGroupsPart2);

    console.log(
      "Part 1 Solution -",
      possibleGroupsPart1.reduce((a, b) => a + b, 0)
    );
    console.log(
      "Part 2 Solution -",
      possibleGroupsPart2.reduce((a, b) => a + b, 0)
    );
  }
);
