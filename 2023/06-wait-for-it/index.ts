import path from "path";
import fs from "fs";

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const [timeRow, distanceRow] = data
      .split("\n")
      .map((row) => row.match(/\d+/g)?.map((d) => parseInt(d, 10)));

    if (!timeRow || !distanceRow) throw new Error("Invalid input");

    const allRaceDistances = timeRow.map((time) => {
      let raceDistances: number[] = [];
      for (let pushTime = 0; pushTime <= time; pushTime++) {
        const moveTime = time - pushTime;
        raceDistances.push(moveTime * pushTime);
      }
      return raceDistances;
    });

    const winCounts = allRaceDistances.map((raceDistances, index) => {
      const minDistance = distanceRow[index];
      return raceDistances.reduce(
        (acc, curr) => (curr > minDistance ? acc + 1 : acc),
        0
      );
    });

    const part1Result = winCounts.reduce((acc, curr) => acc * curr, 1);

    console.log("Part 1 Solution -", part1Result);

    const longRaceTime = parseInt(timeRow.map(String).join(""), 10);
    const longRaceDistance = parseInt(distanceRow.map(String).join(""), 10);

    let minPushTime = 0;
    for (let pushTime = 0; pushTime <= longRaceTime; pushTime++) {
      const moveTime = longRaceTime - pushTime;
      const distanceCovered = moveTime * pushTime;
      if (distanceCovered >= longRaceDistance) {
        minPushTime = pushTime;
        break;
      }
    }

    const totalNumberOfRaceOptions = longRaceTime + 1; // Includes 0 push
    const allWinningOptions = totalNumberOfRaceOptions - 2 * minPushTime; // Remove both ends of the range

    console.log("Part 2 Solution -", allWinningOptions);
  }
);
