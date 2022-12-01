const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const elfCalories = data
    .split("\n\n")
    .map((elfMeals) =>
      elfMeals.split("\n").reduce((acc, curr) => acc + parseInt(curr, 10), 0)
    );
  const sortedlfCalories = elfCalories.sort((a, b) => (a > b ? -1 : 1));

  console.log("Part 1 Solution: ", sortedlfCalories[0]);

  const topThree = sortedlfCalories.slice(0, 3);
  const topThreeSum = topThree.reduce((acc, curr) => acc + curr, 0);

  console.log("Part 2 Solution: ", topThreeSum);
});
