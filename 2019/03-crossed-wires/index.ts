import path from "path";
import fs from "fs";

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const wirePaths = data.split("\n").map((x) => x.split(","));

  const wireCoordinates = wirePaths.map((path) => getAllPathCoordinates(path));

  const intersectionPoints: {
    point: Point;
    firstWireNumberOfSteps: number;
    secondWireNumberOfSteps: number;
  }[] = [];
  wireCoordinates[0].forEach((firstWireCoord, firstCoordIndex) =>
    wireCoordinates[1].forEach((secondWireCoord, secondCoordIndex) => {
      if (
        firstWireCoord.x === secondWireCoord.x &&
        firstWireCoord.y === secondWireCoord.y
      ) {
        intersectionPoints.push({
          point: firstWireCoord,
          firstWireNumberOfSteps: firstCoordIndex + 1,
          secondWireNumberOfSteps: secondCoordIndex + 1,
        });
      }
    })
  );
  console.log(intersectionPoints);
  const manhattanDistances = intersectionPoints.map(
    (intersectionPoint) =>
      Math.abs(intersectionPoint.point.x) + Math.abs(intersectionPoint.point.y)
  );
  const minimumManhattanDistance = Math.min(...manhattanDistances);

  const steppedDistances = intersectionPoints.map(
    (intersectionPoint) =>
      intersectionPoint.firstWireNumberOfSteps +
      intersectionPoint.secondWireNumberOfSteps
  );
  const minimumSteppedDistance = Math.min(...steppedDistances);

  console.log("Part 1 Answer:", minimumManhattanDistance);
  console.log("Part 2 Answer:", minimumSteppedDistance);
});

interface Point {
  x: number;
  y: number;
}
const getAllPathCoordinates = (path: string[]): Point[] => {
  let currentX = 0;
  let currentY = 0;

  const coordinates: Point[] = [];
  path.forEach((pathElement) => {
    const [direction, ...distanceString] = pathElement;
    const distance = parseInt(distanceString.join(""), 10);

    switch (direction) {
      case "L": {
        const xDeltaCoords = Array.from({ length: distance }, (_, i) => -i - 1);
        coordinates.push(
          ...xDeltaCoords.map((xDelta) => ({
            x: currentX + xDelta,
            y: currentY,
          }))
        );
        currentX = currentX - distance;
        break;
      }
      case "R": {
        const xDeltaCoords = Array.from({ length: distance }, (_, i) => i + 1);
        coordinates.push(
          ...xDeltaCoords.map((xDelta) => ({
            x: currentX + xDelta,
            y: currentY,
          }))
        );
        currentX = currentX + distance;
        break;
      }
      case "D": {
        const yDeltaCoords = Array.from({ length: distance }, (_, i) => -i - 1);
        coordinates.push(
          ...yDeltaCoords.map((yDelta) => ({
            x: currentX,
            y: currentY + yDelta,
          }))
        );
        currentY = currentY - distance;
        break;
      }
      case "U": {
        const yDeltaCoords = Array.from({ length: distance }, (_, i) => i + 1);
        coordinates.push(
          ...yDeltaCoords.map((yDelta) => ({
            x: currentX,
            y: currentY + yDelta,
          }))
        );
        currentY = currentY + distance;
        break;
      }
      default:
        throw new Error("Unknown direction encountered");
    }
  });

  return coordinates;
};
