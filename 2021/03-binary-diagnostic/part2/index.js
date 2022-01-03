const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "../input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const binaryNumbers = data.split("\n");
  const binaryNumberLength = binaryNumbers[0].length;
  let oxygenRating = "";
  let co2Rating = "";
  let holdingBinaries = binaryNumbers;

  for (let i = 0; i < binaryNumberLength; i++) {
    const positionToExamine = i;
    const mostCommon = mostCommonInBitPosition(
      holdingBinaries,
      positionToExamine
    );
    holdingBinaries = holdingBinaries.filter(
      (bin) => bin[positionToExamine] === mostCommon
    );

    if (holdingBinaries.length === 1) {
      oxygenRating = holdingBinaries[0];
      break;
    }
  }

  holdingBinaries = binaryNumbers;
  for (let i = 0; i < binaryNumberLength; i++) {
    const positionToExamine = i;
    const leastCommon = leastCommonInBitPosition(
      holdingBinaries,
      positionToExamine
    );
    holdingBinaries = holdingBinaries.filter(
      (bin) => bin[positionToExamine] === leastCommon
    );

    if (holdingBinaries.length === 1) {
      co2Rating = holdingBinaries[0];
      break;
    }
  }

  console.log(
    "Oxygen Rating:",
    parseInt(oxygenRating, 2),
    "CO2 Rating:",
    parseInt(co2Rating, 2)
  );
  console.log(
    "Part 2 Answer:",
    parseInt(oxygenRating, 2) * parseInt(co2Rating, 2)
  );
});

const mostCommonInBitPosition = (binaryNumbers, positionToCheck) => {
  let countOfOnes = 0;
  for (let i = 0; i < binaryNumbers.length; i++) {
    if (binaryNumbers[i][positionToCheck] === "1") {
      countOfOnes += 1;
    }
  }

  if (countOfOnes >= binaryNumbers.length / 2) {
    return "1";
  } else {
    return "0";
  }
};

const leastCommonInBitPosition = (binaryNumbers, positionToCheck) => {
  const mostCommon = mostCommonInBitPosition(binaryNumbers, positionToCheck);
  if (mostCommon === "1") return "0";
  return "1";
};
