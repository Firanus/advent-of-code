import path from "path";
import fs from "fs";

const encodePosition = (row: number, col: number): string => `${row},${col}`;

const inBounds = (row: number, col: number, map: string[][]): boolean =>
  row >= 0 && row < map.length && col >= 0 && col < map[0].length;

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const map = data.split("\n").map((line) => line.split(""));
    const antennaMap = map.reduce<{ [key: string]: [number, number][] }>(
      (acc, row, y) => {
        row.forEach((cell, x) => {
          if (cell !== ".") {
            if (!acc[cell]) {
              acc[cell] = [[x, y]];
            } else {
              acc[cell].push([x, y]);
            }
          }
        });
        return acc;
      },
      {}
    );

    const antiNodesPart1 = Object.values(antennaMap).reduce<Set<string>>(
      (acc, antennaPositionArray) => {
        if (antennaPositionArray.length > 1) {
          for (let i = 0; i < antennaPositionArray.length; i++) {
            for (let j = i + 1; j < antennaPositionArray.length; j++) {
              const [x1, y1] = antennaPositionArray[i];
              const [x2, y2] = antennaPositionArray[j];
              const dx = x2 - x1;
              const dy = y2 - y1;

              if (inBounds(x2 + dx, y2 + dy, map)) {
                acc.add(encodePosition(x2 + dx, y2 + dy));
              }
              if (inBounds(x1 - dx, y1 - dy, map)) {
                acc.add(encodePosition(x1 - dx, y1 - dy));
              }
            }
          }
        }
        return acc;
      },
      new Set()
    );

    const antiNodesPart2 = Object.values(antennaMap).reduce<Set<string>>(
      (acc, antennaPositionArray) => {
        if (antennaPositionArray.length > 1) {
          for (let i = 0; i < antennaPositionArray.length; i++) {
            for (let j = i + 1; j < antennaPositionArray.length; j++) {
              const [x1, y1] = antennaPositionArray[i];
              const [x2, y2] = antennaPositionArray[j];
              const dx = x2 - x1;
              const dy = y2 - y1;
              let multiple = 0;

              while (
                inBounds(x2 + dx * multiple, y2 + dy * multiple, map) ||
                inBounds(x1 - dx * multiple, y1 - dy * multiple, map)
              ) {
                if (inBounds(x2 + dx * multiple, y2 + dy * multiple, map)) {
                  acc.add(
                    encodePosition(x2 + dx * multiple, y2 + dy * multiple)
                  );
                }
                if (inBounds(x1 - dx * multiple, y1 - dy * multiple, map)) {
                  acc.add(
                    encodePosition(x1 - dx * multiple, y1 - dy * multiple)
                  );
                }
                multiple++;
              }
            }
          }
        }
        return acc;
      },
      new Set()
    );

    console.log("Part 1 Solution - ", antiNodesPart1.size);
    console.log("Part 2 Solution - ", antiNodesPart2.size);
  }
);
