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

const generateAllGroupsWithCounts = (
  damagedGroup: string[],
  allowedContinguousLengths: number[]
): { [key: string]: number } => {
  let groupCounts = {} as { [key: string]: number };

  for (let i = 0; i < damagedGroup.length; i++) {
    const existingGroups = Object.keys(groupCounts);
    const newGroupCounts = {} as { [key: string]: number };

    if (damagedGroup[i] === "?") {
      for (const group of existingGroups) {
        newGroupCounts[group + "#"] = groupCounts[group] || 1;
        newGroupCounts[group + "."] = groupCounts[group] || 1;
      }
      if (existingGroups.length === 0) {
        newGroupCounts["#"] = 1;
        newGroupCounts["."] = 1;
      }
    } else {
      for (const group of existingGroups) {
        newGroupCounts[group + damagedGroup[i]] = groupCounts[group] || 1;
      }
      if (existingGroups.length === 0) {
        newGroupCounts[damagedGroup[i]] = 1;
      }
    }

    // Compress dots
    for (const group of Object.keys(newGroupCounts)) {
      const compressedGroup = group
        .split("")
        .filter((c, i) => c !== "." || (i > 0 && c !== group[i - 1]))
        .join("");

      if (compressedGroup !== group) {
        newGroupCounts[compressedGroup] =
          (newGroupCounts[compressedGroup] ?? 0) + newGroupCounts[group];
        delete newGroupCounts[group];
      }
    }

    // Remove invalid groups
    for (const group of Object.keys(newGroupCounts)) {
      if (!isPartialGroupValid(group.split(""), allowedContinguousLengths)) {
        delete newGroupCounts[group];
      }
    }

    groupCounts = newGroupCounts;
  }

  return groupCounts;
};

const countPossibleGroups = (
  damagedGroup: string[],
  allowedContinguousLengths: number[]
): number => {
  const groupCounts = generateAllGroupsWithCounts(
    damagedGroup,
    allowedContinguousLengths
  );
  const validGroups = Object.keys(groupCounts).filter((g) =>
    isFullGroupValid(g.split(""), allowedContinguousLengths)
  );

  return validGroups.reduce((acc, group) => acc + groupCounts[group], 0);
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const [possibleGroupsPart1, possibleGroupsPart2] = data
      .split("\n")
      .map((row, index, arr) => {
        console.log("Processing row", index, "of", arr.length, "...");
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
