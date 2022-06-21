const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const moduleMasses = data.split("\n").map((x) => parseInt(x, 10));
  const baseFuelRequirement = moduleMasses.reduce(
    (acc, curr) => acc + Math.floor(curr / 3) - 2,
    0
  );

  const totalFuelRequirement = moduleMasses.reduce(
    (acc, curr) => acc + calculateTotalFuelRequirementForMass(curr),
    0
  );

  console.log("Part 1 Answer: ", baseFuelRequirement);
  console.log("Part 2 Answer: ", totalFuelRequirement);
});

const calculateTotalFuelRequirementForMass = (moduleMass) => {
  const initialRequirement = Math.floor(moduleMass / 3) - 2;

  let totalRequirement = initialRequirement;
  let currentRequirement = initialRequirement;

  while (currentRequirement > 0) {
    currentRequirement = Math.max(0, Math.floor(currentRequirement / 3) - 2);
    totalRequirement += currentRequirement;
  }

  return totalRequirement;
};
