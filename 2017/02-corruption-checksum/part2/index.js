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
    for (let i = 0; i < row.length; i++) {
      for (let j = i + 1; j < row.length; j++) {
        const bigger = Math.max(row[i], row[j]);
        const smaller = Math.min(row[i], row[j]);

        if (bigger % smaller === 0) {
          checksum += bigger / smaller;
        }
      }
    }
  });

  console.log("Part 2 answer:", checksum);
});
