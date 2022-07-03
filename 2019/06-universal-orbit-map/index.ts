import path from "path";
import fs from "fs";

interface Orbit {
  key: string;
  orbitCount?: number;
  distanceFromYOU?: number;
  bodiesOrbited: string[];
  bodiesWhoOrbitThis: string[];
}

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const inputPairings: [string, string][] = data
      .split("\n")
      .map((x) => x.split(")") as [string, string]);
    const mapOfOrbits: { [key: string]: Orbit } = {};

    inputPairings.forEach(([orbiteeKey, orbiterKey]) => {
      const orbitee: Orbit = mapOfOrbits[orbiteeKey] ?? {
        key: orbiteeKey,
        bodiesOrbited: [],
        bodiesWhoOrbitThis: [],
      };
      const orbiter: Orbit = mapOfOrbits[orbiterKey] ?? {
        key: orbiterKey,
        bodiesOrbited: [],
        bodiesWhoOrbitThis: [],
      };

      orbiter.bodiesOrbited.push(orbiteeKey);
      orbitee.bodiesWhoOrbitThis.push(orbiterKey);
      mapOfOrbits[orbiteeKey] = orbitee;
      mapOfOrbits[orbiterKey] = orbiter;
    });

    // Part 1 - Get all orbit counts
    let nodesToCountOrbitsFor = ["COM"];
    while (nodesToCountOrbitsFor.length > 0) {
      const orbitKey = nodesToCountOrbitsFor.shift()!;
      const orbit = mapOfOrbits[orbitKey];

      const orbitCount = orbit.bodiesOrbited.reduce(
        (acc, curr) => acc + (mapOfOrbits[curr].orbitCount ?? 0) + 1,
        0
      );
      orbit.orbitCount = orbitCount;
      nodesToCountOrbitsFor.push(...orbit.bodiesWhoOrbitThis);
    }

    const result = Object.keys(mapOfOrbits).reduce(
      (acc, curr) => acc + (mapOfOrbits[curr].orbitCount ?? 0),
      0
    );
    console.log("Part 1 Results:", result);

    // Part 2 - Get distance between YOU and SAN
    let nodesToInspect = ["YOU"];
    while (nodesToInspect.length > 0) {
      const orbitKey = nodesToInspect.shift()!;
      const orbit = mapOfOrbits[orbitKey];

      const neighbors = [...orbit.bodiesOrbited, ...orbit.bodiesWhoOrbitThis];

      const distanceFromYOU =
        orbitKey === "YOU"
          ? 0
          : 1 +
            neighbors.reduce(
              (acc, curr) =>
                Math.min(
                  acc,
                  mapOfOrbits[curr].distanceFromYOU ?? Number.MAX_SAFE_INTEGER
                ),
              Number.MAX_SAFE_INTEGER
            );
      orbit.distanceFromYOU = distanceFromYOU;
      neighbors.forEach((neighborKey) => {
        const neighbor = mapOfOrbits[neighborKey];
        if (neighbor.distanceFromYOU === undefined) {
          nodesToInspect.push(neighborKey);
        }
      });
    }

    const sanDistanceFromYou = mapOfOrbits["SAN"].distanceFromYOU!;
    const numberOfTransfers = sanDistanceFromYou - 2;
    console.log("Part 2 Results:", numberOfTransfers);
  }
);
