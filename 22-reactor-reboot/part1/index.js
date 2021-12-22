const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const instructions = data.split("\n").map(processInstructions);
  console.log(instructions.map((x) => x[1]));

  const onCubes = {};
  instructions.forEach((instruction) => {
    const shouldSwitchOn = instruction[0];
    const [xRange, yRange, zRange] = instruction[1];

    if (shouldSwitchOn) {
      for (let x = xRange[0]; x <= xRange[1]; x++) {
        for (let y = yRange[0]; y <= yRange[1]; y++) {
          for (let z = zRange[0]; z <= zRange[1]; z++) {
            onCubes[genKey(x, y, z)] = true;
          }
        }
      }
    } else {
      for (let x = xRange[0]; x <= xRange[1]; x++) {
        for (let y = yRange[0]; y <= yRange[1]; y++) {
          for (let z = zRange[0]; z <= zRange[1]; z++) {
            delete onCubes[genKey(x, y, z)];
          }
        }
      }
    }
    console.log(Object.keys(onCubes).length);
  });
});

const genKey = (x, y, z) => `${x}:${y}:${z}`;

const processInstructions = (stringInput) => {
  const sections = stringInput.split(" ");
  const isOn = sections[0] === "on";

  const coordinateRanges = sections[1].split(",").map((q) => {
    const coordinates = q.slice(2).split("..");
    const start = Math.min(coordinates[0], coordinates[1]);
    const end = Math.max(coordinates[0], coordinates[1]);
    return [start, end];
  });

  return [isOn, coordinateRanges];
};
