const finalMap = require("./finalMap");

const scannerCoordinates = finalMap.map((x) =>
  x
    .slice(1, x.length - 1)
    .split(",")
    .map((x) => parseInt(x))
);

let maxManhattanDistance = -1;
for (let i = 0; i < scannerCoordinates.length - 1; i++) {
  for (let j = i + 1; j < scannerCoordinates.length; j++) {
    let firstCoordinate = scannerCoordinates[i];
    let secondCoordinate = scannerCoordinates[j];

    let manhattanDistance = 0;
    for (let k = 0; k < firstCoordinate.length; k++) {
      manhattanDistance += Math.abs(firstCoordinate[k] - secondCoordinate[k]);
    }
    maxManhattanDistance = Math.max(maxManhattanDistance, manhattanDistance);
  }
}

console.log(maxManhattanDistance);
