const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "../input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const binaryNumbers = data.split("\n");
  const countOfBinaries = binaryNumbers.length;
  const countOfOnes = binaryNumbers.reduce((acc, curr) => {
    for (let i = 0; i < curr.length; i++) {
      if (curr[i] === "1") {
        acc[i] += 1;
      }
    }

    return acc;
  }, new Array(binaryNumbers[0].length).fill(0));

  let gammaRate = "";
  let epsilonRate = "";

  for (let i = 0; i < countOfOnes.length; i++) {
    if (countOfOnes[i] > countOfBinaries / 2) {
      gammaRate += "1";
      epsilonRate += "0";
    } else {
      gammaRate += "0";
      epsilonRate += "1";
    }
  }

  console.log(
    "Gamma Rate:",
    parseInt(gammaRate, 2),
    "Epsilon Rate:",
    parseInt(epsilonRate, 2)
  );
  console.log(
    "Part 1 Answer:",
    parseInt(gammaRate, 2) * parseInt(epsilonRate, 2)
  );
});
