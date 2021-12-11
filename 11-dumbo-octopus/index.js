const path = require("path");
const fs = require("fs");

let flashCount = 0;
fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const initialRowStrings = data.split("\n");
  const octopi = [];
  for (let i = 0; i < initialRowStrings.length; i++) {
    const initialRowString = initialRowStrings[i];
    const initialOctopiRow = initialRowString
      .split("")
      .map((x) => ({ energyLevel: parseInt(x), hasFlashedThisTurn: false }));

    octopi.push(initialOctopiRow);
  }

  // For Part 1:
  //
  // for (let i = 0; i < 100; i++) {
  //   enactStep(octopi);
  // }
  // console.log(flashCount);

  // For Part 2:
  let everyOctopusFlashed = false;
  let stepsPassed = 0;
  while (!everyOctopusFlashed) {
    enactStep(octopi);
    stepsPassed += 1;

    everyOctopusFlashed = true;
    for (let i = 0; i < octopi.length; i++) {
      for (let j = 0; j < octopi[0].length; j++) {
        if (octopi[i][j].energyLevel > 0) {
          everyOctopusFlashed = false;
        }
      }
    }
  }
  console.log(stepsPassed);
});

const enactStep = (octopi) => {
  for (let i = 0; i < octopi.length; i++) {
    for (let j = 0; j < octopi[0].length; j++) {
      octopi[i][j].energyLevel += 1;
    }
  }

  for (let i = 0; i < octopi.length; i++) {
    for (let j = 0; j < octopi[0].length; j++) {
      const octopus = octopi[i][j];
      if (octopus.energyLevel > 9) {
        flashOctopus(octopi, i, j);
      }
    }
  }

  for (let i = 0; i < octopi.length; i++) {
    for (let j = 0; j < octopi[0].length; j++) {
      if (octopi[i][j].hasFlashedThisTurn) {
        octopi[i][j].energyLevel = 0;
        octopi[i][j].hasFlashedThisTurn = false;
      }
    }
  }
};

const flashOctopus = (octopi, rowIndex, colIndex) => {
  if (octopi[rowIndex][colIndex].hasFlashedThisTurn) {
    return;
  }
  octopi[rowIndex][colIndex].hasFlashedThisTurn = true;
  flashCount += 1;

  bumpOctopusEnergyLevel(octopi, rowIndex + 1, colIndex);
  bumpOctopusEnergyLevel(octopi, rowIndex - 1, colIndex);
  bumpOctopusEnergyLevel(octopi, rowIndex, colIndex + 1);
  bumpOctopusEnergyLevel(octopi, rowIndex, colIndex - 1);
  bumpOctopusEnergyLevel(octopi, rowIndex + 1, colIndex + 1);
  bumpOctopusEnergyLevel(octopi, rowIndex + 1, colIndex - 1);
  bumpOctopusEnergyLevel(octopi, rowIndex - 1, colIndex + 1);
  bumpOctopusEnergyLevel(octopi, rowIndex - 1, colIndex - 1);
};

const bumpOctopusEnergyLevel = (octopi, rowIndex, colIndex) => {
  if (
    rowIndex < 0 ||
    rowIndex >= octopi.length ||
    colIndex < 0 ||
    colIndex >= octopi[0].length
  ) {
    return;
  }

  octopi[rowIndex][colIndex].energyLevel += 1;
  if (octopi[rowIndex][colIndex].energyLevel > 9) {
    flashOctopus(octopi, rowIndex, colIndex);
  }
};
