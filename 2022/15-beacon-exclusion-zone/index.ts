import path from "path";
import fs from "fs";

interface GridPoint {
  x: number;
  y: number;
  isSensor: boolean;
  closestBeacon?: GridPoint;
  isBeacon: boolean;
  cannotHaveBeacon: boolean;
}

type CoveredRange = {
  yCoord: number;
  startXCoord: number;
  endXCoord: number;
};

const encodeCoordinate = (gridPoint: GridPoint) =>
  `${gridPoint.x}-${gridPoint.y}`;

const processCoordinateString = (
  coordinateString: string
): { x: number; y: number } => {
  const xRegex = /(?<=x=).*?(?=\,)/;
  const yRegex = /(?<=y=).*?$/;

  const x = parseInt(coordinateString.match(xRegex)?.[0] ?? "", 10);
  const y = parseInt(coordinateString.match(yRegex)?.[0] ?? "", 10);

  return { x, y };
};

const calculateManhattanDistance = (a: GridPoint, b: GridPoint) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const MIN_X = 0;
const MAX_X = 4000000;
const MIN_Y = 0;
const MAX_Y = 4000000;
const PART_1_Y_COORD = 2000000;

const calculateExcludedPointsOnYCoordinate = (
  sensorGridPoint: GridPoint,
  yCoordinate: number,
  minXCoordinate?: number,
  maxXCoordinate?: number
): CoveredRange | undefined => {
  if (
    !sensorGridPoint.isSensor ||
    sensorGridPoint.closestBeacon === undefined
  ) {
    throw new Error("Cannot calculate excluded points for non-sensor.");
  }

  const manhattanDistance = calculateManhattanDistance(
    sensorGridPoint,
    sensorGridPoint.closestBeacon
  );

  if (
    !isBetween(yCoordinate, {
      start: sensorGridPoint.y - manhattanDistance,
      end: sensorGridPoint.y + manhattanDistance,
    })
  ) {
    return undefined;
  }

  const distanceToYCoordinate = Math.abs(sensorGridPoint.y - yCoordinate);
  const maxXDistance = manhattanDistance - distanceToYCoordinate;

  const startCoord = sensorGridPoint.x - maxXDistance;
  const endCoord = sensorGridPoint.x + maxXDistance;
  return {
    yCoord: yCoordinate,
    startXCoord:
      minXCoordinate !== undefined
        ? Math.max(startCoord, minXCoordinate)
        : startCoord,
    endXCoord:
      maxXCoordinate !== undefined
        ? Math.min(endCoord, maxXCoordinate)
        : endCoord,
  };
};

const isBetween = (point: number, range: { start: number; end: number }) =>
  point >= range.start && point <= range.end;

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const { sensors, beacons } = data
      .split("\n")
      .reduce<{ sensors: GridPoint[]; beacons: GridPoint[] }>(
        (acc, curr) => {
          const sensorRegex = /(?<=Sensor at ).*?(?=\:)/;
          const beaconRegex = /(?<=closest beacon is at ).*?$/;

          const sensorString = curr.match(sensorRegex)?.[0] ?? "";
          const beaconString = curr.match(beaconRegex)?.[0] ?? "";

          const beacon: GridPoint = {
            ...processCoordinateString(beaconString),
            isSensor: false,
            isBeacon: true,
            cannotHaveBeacon: true,
          };
          const sensor: GridPoint = {
            ...processCoordinateString(sensorString),
            isSensor: true,
            isBeacon: false,
            cannotHaveBeacon: true,
            closestBeacon: beacon,
          };

          if (
            !acc.sensors.find(
              (s) => encodeCoordinate(s) === encodeCoordinate(sensor)
            )
          ) {
            acc.sensors.push(sensor);
          }
          if (
            !acc.beacons.find(
              (b) => encodeCoordinate(b) === encodeCoordinate(beacon)
            )
          ) {
            acc.beacons.push(beacon);
          }
          return acc;
        },
        { sensors: [], beacons: [] }
      );

    let excludedPointsForPart1 = 0;
    let onlyUncoveredPointForPart2: { x: number; y: number } | undefined =
      undefined;

    for (let y = MIN_Y; y <= MAX_Y; y++) {
      const allCoveredRanges = sensors.reduce<CoveredRange[]>((acc, curr) => {
        let coveredRange: CoveredRange | undefined = undefined;
        if (y === PART_1_Y_COORD) {
          coveredRange = calculateExcludedPointsOnYCoordinate(curr, y);
        } else {
          coveredRange = calculateExcludedPointsOnYCoordinate(
            curr,
            y,
            MIN_X,
            MAX_X
          );
        }
        if (coveredRange) {
          acc.push(coveredRange);
        }
        return acc;
      }, []);

      allCoveredRanges.sort((a, b) => a.startXCoord - b.startXCoord);
      const compactIntervals: CoveredRange[] = [];
      for (let i = 0; i < allCoveredRanges.length; i++) {
        const interval = allCoveredRanges[i];
        const overlappingInterval = compactIntervals.find(
          (candidateInterval) =>
            isBetween(interval.startXCoord, {
              start: candidateInterval.startXCoord,
              end: candidateInterval.endXCoord,
            }) ||
            isBetween(interval.endXCoord, {
              start: candidateInterval.startXCoord,
              end: candidateInterval.endXCoord,
            })
        );

        if (!overlappingInterval) {
          compactIntervals.push({ ...interval });
        } else {
          if (
            isBetween(interval.startXCoord, {
              start: overlappingInterval.startXCoord,
              end: overlappingInterval.endXCoord,
            }) &&
            isBetween(interval.endXCoord, {
              start: overlappingInterval.startXCoord,
              end: overlappingInterval.endXCoord,
            })
          ) {
            continue;
          }
          if (
            isBetween(interval.startXCoord, {
              start: overlappingInterval.startXCoord,
              end: overlappingInterval.endXCoord,
            })
          ) {
            overlappingInterval.endXCoord = interval.endXCoord;
          } else {
            overlappingInterval.startXCoord = interval.startXCoord;
          }
        }
      }

      const beaconsAndSensorsInRange: number = compactIntervals.reduce(
        (acc, curr) => {
          let localAcc = 0;
          [...sensors, ...beacons].forEach((unit) => {
            if (
              unit.y === curr.yCoord &&
              isBetween(unit.x, {
                start: curr.startXCoord,
                end: curr.endXCoord,
              })
            ) {
              localAcc += 1;
            }
          });
          return acc + localAcc;
        },
        0
      );

      if (y === PART_1_Y_COORD) {
        const sizeOfCompactIntervals = compactIntervals.reduce(
          (acc, curr) => acc + Math.abs(curr.endXCoord - curr.startXCoord) + 1,
          0
        );

        const solution = sizeOfCompactIntervals - beaconsAndSensorsInRange;
        console.log("Part 1 Solution:", solution);
      } else if (compactIntervals.length > 1) {
        const tuningFrequency =
          (compactIntervals[0].endXCoord + 1) * 4000000 +
          compactIntervals[0].yCoord;
        console.log("Part 2 Solution:", tuningFrequency);
        break;
      }
    }
  }
);
