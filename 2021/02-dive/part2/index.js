const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "../input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const instructions = data.split("\n");
  const finalPositions = instructions.reduce(
    (acc, curr) => {
      const [direction, sizeString] = curr.split(" ");
      const size = parseInt(sizeString, 10);
      if (direction === "forward") {
        acc.horizontal += size;
        acc.depth += acc.aim * size;
      }

      if (direction === "down") {
        acc.aim += size;
      }

      if (direction === "up") {
        acc.aim -= size;
      }

      return acc;
    },
    { horizontal: 0, depth: 0, aim: 0 }
  );

  console.log(finalPositions);
  console.log(
    "Part 2 Answer:",
    finalPositions.depth * finalPositions.horizontal
  );
});
