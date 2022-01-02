const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const instructions = data.split("\n").map(processInstructions);

  let positiveCubes = [];
  let negativeCubes = [];
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    const shouldTurnOn = instruction[0];
    const coordsToChange = instruction[1];

    const overlapsWithPositiveCubes = getOverlappingCubes(
      coordsToChange,
      positiveCubes
    );
    const overlapsWithNegativeCubes = getOverlappingCubes(
      coordsToChange,
      negativeCubes
    );

    if (shouldTurnOn) {
      positiveCubes.push(coordsToChange);
    }
    positiveCubes = positiveCubes.concat(overlapsWithNegativeCubes);
    negativeCubes = negativeCubes.concat(overlapsWithPositiveCubes);
  }

  let totalArea = 0;
  let positiveIndex = 0;
  let negativeIndex = 0;
  let pullPositiveNext = true;
  while (
    positiveIndex < positiveCubes.length ||
    negativeIndex < negativeCubes.length
  ) {
    if (positiveIndex >= positiveCubes.length) {
      totalArea -= getCubeVolume(negativeCubes[negativeIndex]);
      negativeIndex += 1;
      continue;
    }

    if (negativeIndex >= negativeCubes.length) {
      totalArea += getCubeVolume(positiveCubes[positiveIndex]);
      positiveIndex += 1;
      continue;
    }

    if (pullPositiveNext) {
      totalArea += getCubeVolume(positiveCubes[positiveIndex]);
      positiveIndex += 1;
    } else {
      totalArea -= getCubeVolume(negativeCubes[negativeIndex]);
      negativeIndex += 1;
    }
    pullPositiveNext = !pullPositiveNext;
  }

  console.log(totalArea);
});

const getCubeVolume = (cube) =>
  (1 + Math.abs(cube[0][1] - cube[0][0])) *
  (1 + Math.abs(cube[1][1] - cube[1][0])) *
  (1 + Math.abs(cube[2][1] - cube[2][0]));

const getOverlappingCubes = (instructionCoords, cubes) => {
  const overlappingCubes = [];
  const existingCubes = cubes;
  for (let i = 0; i < existingCubes.length; i++) {
    const cubeCoords = existingCubes[i];
    const overlapCube = getOverlapCube(cubeCoords, instructionCoords);
    if (overlapCube) {
      overlappingCubes.push(overlapCube);
    }
  }

  return overlappingCubes;
};

const getOverlapCube = (threeDCoordsA, threeDCoordsB) => {
  const xAxisOverlap = axisOverlap(threeDCoordsA[0], threeDCoordsB[0]);
  const yAxisOverlap = axisOverlap(threeDCoordsA[1], threeDCoordsB[1]);
  const zAxisOverlap = axisOverlap(threeDCoordsA[2], threeDCoordsB[2]);

  if (xAxisOverlap && yAxisOverlap && zAxisOverlap) {
    return [xAxisOverlap, yAxisOverlap, zAxisOverlap];
  }
  return undefined;
};

const axisOverlap = (oneDCoordsA, oneDCoordsB) => {
  const greaterMin = Math.max(oneDCoordsA[0], oneDCoordsB[0]);
  const lesserMax = Math.min(oneDCoordsA[1], oneDCoordsB[1]);

  if (greaterMin <= lesserMax) {
    return [greaterMin, lesserMax];
  }
  return undefined;
};

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
