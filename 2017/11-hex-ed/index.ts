import path from "path";
import fs from "fs";

type Step = "n" | "s" | "ne" | "sw" | "se" | "nw";
type HexCoord = { x: number; y: number; z: number };

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const steps: Step[] = data.split(",").map((x) => x as Step);

  /*
    We need to define our coordinate system using this article we're using as a reference:
    https://www.redblobgames.com/grids/hexagons/
    
    It's important that our coordinate system is actually at a 30 degree angle to
    our actual hex arrangement. This allows us to give each hexagon a canonical 
    coordinate, which will make everything way easier. For example:

        +y   _____
         \  /     \
      ____\/  0,1  \_____
     /     \  -1   /     \
    / -1,1  \_____/  1,0  \
    \   0   /     \  -1   /
     \_____/  0,0  \_____/______+x
     /     \   0   /     \
    / -1,0  \_____/  1,-1 \
    \   1   /     \   0   /               
     \_____/  0,-1 \_____/
          /\   1   /
         /  \_____/
        +z
    
    Thus, the steps have the following effects:
    * N  - (0, 1, -1)
    * S  - (0, -1, 1)
    * NE - (1, 0, -1)
    * SW - (-1, 0, 1)
    * SE - (1, -1, 0)
    * NW - (-1, 1, 0)
  */

  let distanceFromOrigin = 0;
  let maxDistanceFromOrigin = 0;
  let currentPosition: HexCoord = { x: 0, y: 0, z: 0 };

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    currentPosition = getPositionAfterStep(currentPosition, step);
    distanceFromOrigin = getDistanceFromOrigin(currentPosition);
    maxDistanceFromOrigin = Math.max(maxDistanceFromOrigin, distanceFromOrigin);
  }

  console.log("Part 1 Answer:", distanceFromOrigin);
  console.log("Part 2 Answer:", maxDistanceFromOrigin);
});

const getPositionAfterStep = (
  startingCoord: HexCoord,
  step: Step
): HexCoord => {
  const currentPosition = { ...startingCoord };
  switch (step) {
    case "n":
      currentPosition.y += 1;
      currentPosition.z -= 1;
      break;
    case "s":
      currentPosition.y -= 1;
      currentPosition.z += 1;
      break;
    case "ne":
      currentPosition.x += 1;
      currentPosition.z -= 1;
      break;
    case "sw":
      currentPosition.x -= 1;
      currentPosition.z += 1;
      break;
    case "se":
      currentPosition.x += 1;
      currentPosition.y -= 1;
      break;
    case "nw":
      currentPosition.x -= 1;
      currentPosition.y += 1;
      break;
  }
  return currentPosition;
};

const getDistanceFromOrigin = (coord: HexCoord): number =>
  Object.values(coord).reduce((acc, curr) => Math.max(acc, Math.abs(curr)), 0);
