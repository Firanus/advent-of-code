import path from "path";
import fs from "fs";

interface Hailstone {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

function isNonNullable<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

const getHailstoneKey = (hailstone: Hailstone): string =>
  `${hailstone.x},${hailstone.y},${hailstone.z}`;

const getCollisionKey = (a: Hailstone, b: Hailstone): string => {
  const aKey = getHailstoneKey(a);
  const bKey = getHailstoneKey(b);
  const first = aKey < bKey ? aKey : bKey;
  const second = aKey < bKey ? bKey : aKey;
  return `${first}-${second}`;
};

const getCollisionPosIn2D = (
  a: Hailstone,
  b: Hailstone
): { x: number; y: number; isInPast: boolean } => {
  const x0 =
    (b.y * b.vx * a.vx -
      b.vy * b.x * a.vx -
      a.y * a.vx * b.vx +
      a.vy * a.x * b.vx) /
    (b.vx * a.vy - b.vy * a.vx);

  const y0 =
    (a.vy * b.y * b.vx -
      a.vy * b.vy * b.x -
      b.vy * a.y * a.vx +
      b.vy * a.vy * a.x) /
    (b.vx * a.vy - b.vy * a.vx);

  const timeA = (x0 - a.x) / a.vx;
  const timeB = (x0 - b.x) / b.vx;

  const isInPastForA = timeA < 0;
  const isInPastForB = timeB < 0;

  return { x: x0, y: y0, isInPast: isInPastForA || isInPastForB };
};

const getCollisionPosIn3D = (
  a: Hailstone,
  b: Hailstone
): { x: number; y: number; z: number; isInPast: boolean } | undefined => {
  const { x: x0, y: y0, isInPast } = getCollisionPosIn2D(a, b);

  if (isNaN(x0) && isNaN(y0)) {
    // Lines are parallel and overlapping in x-y plane
    // Check if they overlap in z

    const redefinedA = { ...a, y: a.z, vy: a.vz };
    const redefinedB = { ...b, y: b.z, vy: b.vz };
    const {
      x: x1,
      y: z0,
      isInPast: isInPastRedefined,
    } = getCollisionPosIn2D(redefinedA, redefinedB);

    const timeA = (x1 - a.x) / a.vx;
    const timeB = (x1 - b.x) / b.vx;

    const yA = a.y + a.vy * timeA;
    const yB = b.y + b.vy * timeB;
    if (yA !== yB) {
      return undefined;
    }

    return { x: x1, y: yA, z: z0, isInPast: isInPastRedefined };
  }

  const timeA = (x0 - a.x) / a.vx;
  const timeB = (x0 - b.x) / b.vx;

  const zA = a.z + a.vz * timeA;
  const zB = b.z + b.vz * timeB;

  if (zA !== zB) {
    return undefined;
  }

  return { x: x0, y: y0, z: zA, isInPast };
};

const doesHailstoneIntersectPoint = (
  point: { x: number; y: number; z: number },
  hailstone: Hailstone
) => {
  const { x, y, z } = point;
  const { x: hx, y: hy, z: hz, vx, vy, vz } = hailstone;

  const timeX = (x - hx) / vx;
  const timeY = (y - hy) / vy;
  const timeZ = (z - hz) / vz;

  return timeX === timeY && timeX === timeZ;
};

const getValidVelocities = (
  hailstones: Hailstone[]
): { vx: number; vy: number; vz: number }[] => {
  const overlapsInX: { distanceDif: number; velocity: number }[] = [];
  const overlapsInY: { distanceDif: number; velocity: number }[] = [];
  const overlapsInZ: { distanceDif: number; velocity: number }[] = [];

  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const a = hailstones[i];
      const b = hailstones[j];
      if (a.vx === b.vx) {
        overlapsInX.push({ distanceDif: Math.abs(a.x - b.x), velocity: a.vx });
      }
      if (a.vy === b.vy) {
        overlapsInY.push({ distanceDif: Math.abs(a.y - b.y), velocity: a.vy });
      }
      if (a.vz === b.vz) {
        overlapsInZ.push({ distanceDif: Math.abs(a.z - b.z), velocity: a.vz });
      }
    }
  }

  const validXVelocities: number[] = [];
  const validYVelocities: number[] = [];
  const validZVelocities: number[] = [];

  const isValidVelocity = (
    v: number,
    overlap: { distanceDif: number; velocity: number }
  ): boolean => overlap.distanceDif % (v - overlap.velocity) === 0;

  for (let i = -1000; i < 1000; i++) {
    const isValidXVelocity = overlapsInX.every((o) => isValidVelocity(i, o));
    const isValidYVelocity = overlapsInY.every((o) => isValidVelocity(i, o));
    const isValidZVelocity = overlapsInZ.every((o) => isValidVelocity(i, o));
    if (isValidXVelocity) {
      validXVelocities.push(i);
    }
    if (isValidYVelocity) {
      validYVelocities.push(i);
    }
    if (isValidZVelocity) {
      validZVelocities.push(i);
    }
  }

  let validVelocities: { vx: number; vy: number; vz: number }[] = [];

  for (let vx of validXVelocities) {
    for (let vy of validYVelocities) {
      for (let vz of validZVelocities) {
        validVelocities.push({ vx, vy, vz });
      }
    }
  }

  return validVelocities;
};

const findIntersectionOfAllLines = (
  velocity: { vx: number; vy: number; vz: number },
  hailstones: Hailstone[]
): { x: number; y: number; z: number } | undefined => {
  // Put all hailstones in the frame of reference of the rock
  const adjustedHailstones = hailstones.map((hailstone) => ({
    ...hailstone,
    vx: hailstone.vx - velocity.vx,
    vy: hailstone.vy - velocity.vy,
    vz: hailstone.vz - velocity.vz,
  }));

  const proposedCollisionPoint = getCollisionPosIn3D(
    adjustedHailstones[0],
    adjustedHailstones[1]
  );

  if (!proposedCollisionPoint) {
    return undefined;
  }

  for (let i = 2; i < adjustedHailstones.length; i++) {
    const hailstone = adjustedHailstones[i];
    if (!doesHailstoneIntersectPoint(proposedCollisionPoint, hailstone)) {
      return undefined;
    }
  }

  return proposedCollisionPoint;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const hailstones = data.split("\n").map((row) => {
      const [x, y, z, vx, vy, vz] = row
        .match(/-?\d+/g)
        ?.map((d) => parseInt(d, 10)) as number[];
      return { x, y, z, vx, vy, vz };
    });

    const collisionPoints: {
      [key: string]: { x: number; y: number; isInPast: boolean };
    } = {};

    for (let i = 0; i < hailstones.length; i++) {
      for (let j = i + 1; j < hailstones.length; j++) {
        const a = hailstones[i];
        const b = hailstones[j];
        const collisionKey = getCollisionKey(a, b);
        const collisionPosition = getCollisionPosIn2D(a, b);
        if (collisionPoints[collisionKey]) {
          continue;
        }
        collisionPoints[collisionKey] = collisionPosition;
      }
    }

    const testAreaMin = 200000000000000;
    const testAreaMax = 400000000000000;

    const part1Result = Object.values(collisionPoints).filter(
      (collisionPoint) =>
        collisionPoint.x >= testAreaMin &&
        collisionPoint.x <= testAreaMax &&
        collisionPoint.y >= testAreaMin &&
        collisionPoint.y <= testAreaMax &&
        !collisionPoint.isInPast
    );

    console.log("Part 1 Solution -", part1Result.length);

    const possibleVelocities = getValidVelocities(hailstones);
    const intersectionPoints = possibleVelocities
      .map((velocity) => findIntersectionOfAllLines(velocity, hailstones))
      .filter(isNonNullable);

    const mainPoint = intersectionPoints[0];
    const sumOfCoords = mainPoint.x + mainPoint.y + mainPoint.z;
    console.log("Part 2 Solution -", sumOfCoords);
  }
);
