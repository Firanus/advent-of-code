const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "../input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const spreadsheet = data
    .split("\n")
    .map((row) => row.split("\t").map((char) => parseInt(char)));

  let checksum = 0;
  spreadsheet.forEach((row) => {
    let min = row.reduce(
      (acc, curr) => Math.min(acc, curr),
      Number.MAX_SAFE_INTEGER
    );
    let max = row.reduce((acc, curr) => Math.max(acc, curr), -1);

    checksum += max - min;
  });

  console.log("Part 1 answer:", checksum);
});
