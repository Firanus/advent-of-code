const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const instructions = data
    .split("\n")
    .map((numberString) => parseInt(numberString));

  const listSize = instructions.length;
  let currentPosition = 0;
  let stepCount = 0;

  while (currentPosition < listSize && currentPosition >= 0) {
    const jump = instructions[currentPosition];

    // Code for Part 1
    // instructions[currentPosition] = jump + 1;

    // Code for Part 2
    if (jump >= 3) {
      instructions[currentPosition] = jump - 1;
    } else {
      instructions[currentPosition] = jump + 1;
    }

    currentPosition += jump;
    stepCount += 1;
  }

  console.log("Step Count:", stepCount);
});
