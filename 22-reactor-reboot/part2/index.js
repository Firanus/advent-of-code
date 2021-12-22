const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./testInput.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const instructions = data.split("\n").map(processInstructions);

  // Let's try storing disjoint rectangular prisms. We'll store them in an array, slicing from lowest z-coordinate.
  const cubes = {};
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    const shouldTurnOn = instruction[0];
    const coordsToChange = instruction[1];
    const overlappingCubes = getOverlappingCubes(coordsToChange, cubes);

    if (!overlappingCubes.length) {
      if (shouldTurnOn) {
        cubes[genKey(coordsToChange)] = coordsToChange;
      }
    }

    console.log(cubes);
  }
});

const getOverlappingCubes = (instructionCoords, cubes) => {
  const overlappingCubes = [];
  const existingCubes = Object.values(cubes);
  for (let i = 0; i < existingCubes.length; i++) {
    const cubeCoords = existingCubes[i];
    if (has3DOverlap(cubeCoords, instructionCoords)) {
      overlappingCubes.push(cubeCoords);
    }
  }

  return overlappingCubes;
};

const has3DOverlap = (threeDCoordsA, threeDCoordsB) => {
  return (
    doesAxisOverlap(threeDCoordsA[0], threeDCoordsB[0]) &&
    doesAxisOverlap(threeDCoordsA[1], threeDCoordsB[1]) &&
    doesAxisOverlap(threeDCoordsA[2], threeDCoordsB[2])
  );
};

const doesAxisOverlap = (oneDCoordsA, oneDCoordsB) => {
  const greaterMin = Math.max(oneDCoordsA[0], oneDCoordsB[0]);
  const lesserMax = Math.min(oneDCoordsA[1], oneDCoordsB[1]);

  return greaterMin <= lesserMax;
};

const genKey = (coordinates) =>
  `${coordinates[0][0]}-${coordinates[0][1]}:${coordinates[1][0]}-${coordinates[1][1]}:${coordinates[2][0]}-${coordinates[2][1]}`;

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
