import path from "path";
import fs from "fs";

type ProcessedPattern = {
  originalScore: number;
  smudgedScore: number;
};

const findReflectionIndex = (
  rows: string[],
  indexToIgnore: number | undefined
) => {
  let reflectionIndex: number | undefined = undefined;

  outer: for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const prevRow = rows[i - 1];

    if (row === prevRow) {
      let increasingIndex = i;
      let decreasingIndex = i - 1;

      while (increasingIndex < rows.length && decreasingIndex >= 0) {
        if (rows[increasingIndex] !== rows[decreasingIndex]) {
          continue outer;
        }
        increasingIndex += 1;
        decreasingIndex -= 1;
      }

      if (indexToIgnore !== i) {
        reflectionIndex = i;
      }
    }
  }

  return reflectionIndex;
};

const getReflectionScore = (
  pattern: string,
  prevRefCol: number | undefined,
  prevRefRow: number | undefined
): number | undefined => {
  const rows = pattern.split("\n");
  const columns = rows[0]
    .split("")
    .map((_, i) => rows.map((row) => row.split("")[i]).join(""));

  let colLeftOfReflectionIndex = findReflectionIndex(columns, prevRefCol);
  let rowAboveReflectionIndex = findReflectionIndex(rows, prevRefRow);

  if (!colLeftOfReflectionIndex && !rowAboveReflectionIndex) {
    return undefined;
  }

  const score =
    (rowAboveReflectionIndex ?? 0) * 100 + (colLeftOfReflectionIndex ?? 0);

  return score;
};

const processPattern = (pattern: string): ProcessedPattern => {
  const originalScore = getReflectionScore(pattern, undefined, undefined);
  if (!originalScore) throw new Error("No original score found");

  const rows = pattern.split("\n").map((s) => s.split(""));
  let smudgedScore = 0;
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[0].length; j++) {
      const rowsCopy = rows.map((row) => [...row]);
      rowsCopy[i][j] = rowsCopy[i][j] === "#" ? "." : "#";
      const alteredPattern = rowsCopy.map((row) => row.join("")).join("\n");

      const tweakedScore = getReflectionScore(
        alteredPattern,
        originalScore % 100,
        Math.floor(originalScore / 100)
      );

      if (tweakedScore && tweakedScore !== originalScore) {
        smudgedScore = tweakedScore;
        break;
      }
    }
  }

  if (!smudgedScore) {
    throw new Error("No smudged score found");
  }

  return {
    originalScore: originalScore ?? 0,
    smudgedScore: smudgedScore ?? 0,
  };
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const patterns = data.split("\n\n").map(processPattern);

    console.log(
      "Part 1 Solution -",
      patterns.reduce((a, b) => a + b.originalScore, 0)
    );

    console.log(
      "Part 2 Solution -",
      patterns.reduce((a, b) => a + b.smudgedScore, 0)
    );
  }
);
