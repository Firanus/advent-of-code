import path from "path";
import fs from "fs";

type RockType = "dash" | "plus" | "back-l" | "pipe" | "square";
type ChamberGrid = boolean[][];

// (0, 0) is top left
type Point = { y: number; x: number };

const addRowToChamber = (chamber: ChamberGrid) =>
  chamber.unshift([false, false, false, false, false, false, false]);

const visualiseChamber = (chamber: ChamberGrid, highlightRows?: number[]) => {
  chamber.forEach((row, index) =>
    console.log(
      `|${row.map((x) => (x ? "#" : ".")).join("")}| - ${index} ${
        highlightRows?.includes(index) ? " <----- HERE" : ""
      }`
    )
  );
  console.log(" ");
};

const getHightestRockInChamber = (chamber: ChamberGrid): number | undefined => {
  const rowIndex = chamber.findIndex((row) => row.some((x) => x));
  if (rowIndex === -1) {
    return undefined;
  }
  return rowIndex;
};

// Returns position of bottom-most, left-most rock coordinate
const addRockToChamber = (rockType: RockType, chamber: ChamberGrid): Point => {
  const highestRockIndex = getHightestRockInChamber(chamber);

  if (highestRockIndex === undefined || highestRockIndex === 0) {
    addRowToChamber(chamber);
    addRowToChamber(chamber);
    addRowToChamber(chamber);
  } else if (highestRockIndex === 1) {
    addRowToChamber(chamber);
    addRowToChamber(chamber);
  } else if (highestRockIndex === 2) {
    addRowToChamber(chamber);
  } else if (highestRockIndex > 3) {
    let rowsToShift = highestRockIndex - 3;
    for (let i = 0; i < rowsToShift; i++) {
      chamber.shift();
    }
  }

  switch (rockType) {
    case "dash":
      chamber.unshift([false, false, true, true, true, true, false]);
      return { y: 0, x: 2 };
    case "plus":
      chamber.unshift(
        ...[
          [false, false, false, true, false, false, false],
          [false, false, true, true, true, false, false],
          [false, false, false, true, false, false, false],
        ]
      );
      return { y: 2, x: 3 };
    case "back-l":
      chamber.unshift(
        ...[
          [false, false, false, false, true, false, false],
          [false, false, false, false, true, false, false],
          [false, false, true, true, true, false, false],
        ]
      );
      return { y: 2, x: 2 };
    case "pipe":
      chamber.unshift(
        ...[
          [false, false, true, false, false, false, false],
          [false, false, true, false, false, false, false],
          [false, false, true, false, false, false, false],
          [false, false, true, false, false, false, false],
        ]
      );
      return { y: 3, x: 2 };
    case "square":
      chamber.unshift(
        ...[
          [false, false, true, true, false, false, false],
          [false, false, true, true, false, false, false],
        ]
      );
      return { y: 1, x: 2 };
  }
};

// rock origin is bottom most, left most point
const moveRockLeftIfPossible = (
  rockType: RockType,
  rockOrigin: Point,
  chamber: ChamberGrid
): Point => {
  switch (rockType) {
    case "dash": {
      const { x, y } = rockOrigin;
      if (rockOrigin.x === 0 || chamber[y][x - 1] === true) return rockOrigin;

      chamber[y][x - 1] = true;
      chamber[y][x + 3] = false;
      return { y, x: x - 1 };
    }
    case "plus": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.x <= 1 ||
        chamber[y][x - 1] === true ||
        chamber[y - 1][x - 2] === true ||
        chamber[y - 2][x - 1] === true
      )
        return rockOrigin;

      chamber[y][x - 1] = true;
      chamber[y][x] = false;

      chamber[y - 2][x - 1] = true;
      chamber[y - 2][x] = false;

      chamber[y - 1][x - 2] = true;
      chamber[y - 1][x + 1] = false;
      return { y, x: x - 1 };
    }
    case "back-l": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.x === 0 ||
        chamber[y][x - 1] === true ||
        chamber[y - 1][x + 1] === true ||
        chamber[y - 2][x + 1] === true
      )
        return rockOrigin;

      chamber[y][x - 1] = true;
      chamber[y][x + 2] = false;

      chamber[y - 1][x + 1] = true;
      chamber[y - 1][x + 2] = false;

      chamber[y - 2][x + 1] = true;
      chamber[y - 2][x + 2] = false;
      return { y, x: x - 1 };
    }
    case "pipe": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.x === 0 ||
        chamber[y][x - 1] === true ||
        chamber[y - 1][x - 1] === true ||
        chamber[y - 2][x - 1] === true ||
        chamber[y - 3][x - 1] === true
      )
        return rockOrigin;

      chamber[y][x - 1] = true;
      chamber[y][x] = false;

      chamber[y - 1][x - 1] = true;
      chamber[y - 1][x] = false;

      chamber[y - 2][x - 1] = true;
      chamber[y - 2][x] = false;

      chamber[y - 3][x - 1] = true;
      chamber[y - 3][x] = false;
      return { y, x: x - 1 };
    }
    case "square": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.x === 0 ||
        chamber[y][x - 1] === true ||
        chamber[y - 1][x - 1] === true
      )
        return rockOrigin;

      chamber[y][x - 1] = true;
      chamber[y][x + 1] = false;

      chamber[y - 1][x - 1] = true;
      chamber[y - 1][x + 1] = false;
      return { y, x: x - 1 };
    }
  }
};

// rock origin is bottom most, left most point
const moveRockRightIfPossible = (
  rockType: RockType,
  rockOrigin: Point,
  chamber: ChamberGrid
): Point => {
  const CHAMBER_WIDTH = chamber[0].length;
  switch (rockType) {
    case "dash": {
      const { x, y } = rockOrigin;
      if (rockOrigin.x + 3 === CHAMBER_WIDTH - 1 || chamber[y][x + 4] === true)
        return rockOrigin;

      chamber[y][x] = false;
      chamber[y][x + 4] = true;
      return { y, x: x + 1 };
    }
    case "plus": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.x + 1 === CHAMBER_WIDTH - 1 ||
        chamber[y][x + 1] === true ||
        chamber[y - 1][x + 2] === true ||
        chamber[y - 2][x + 1] === true
      )
        return rockOrigin;

      chamber[y][x] = false;
      chamber[y][x + 1] = true;

      chamber[y - 1][x - 1] = false;
      chamber[y - 1][x + 2] = true;

      chamber[y - 2][x] = false;
      chamber[y - 2][x + 1] = true;

      return { y, x: x + 1 };
    }
    case "back-l": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.x + 2 === CHAMBER_WIDTH - 1 ||
        chamber[y][x + 3] === true ||
        chamber[y - 1][x + 3] === true ||
        chamber[y - 2][x + 3] === true
      )
        return rockOrigin;

      chamber[y][x] = false;
      chamber[y][x + 3] = true;

      chamber[y - 1][x + 2] = false;
      chamber[y - 1][x + 3] = true;

      chamber[y - 2][x + 2] = false;
      chamber[y - 2][x + 3] = true;
      return { y, x: x + 1 };
    }
    case "pipe": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.x === CHAMBER_WIDTH - 1 ||
        chamber[y][x + 1] === true ||
        chamber[y - 1][x + 1] === true ||
        chamber[y - 2][x + 1] === true ||
        chamber[y - 3][x + 1] === true
      )
        return rockOrigin;

      chamber[y][x] = false;
      chamber[y][x + 1] = true;

      chamber[y - 1][x] = false;
      chamber[y - 1][x + 1] = true;

      chamber[y - 2][x] = false;
      chamber[y - 2][x + 1] = true;

      chamber[y - 3][x] = false;
      chamber[y - 3][x + 1] = true;
      return { y, x: x + 1 };
    }
    case "square": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.x + 1 === CHAMBER_WIDTH - 1 ||
        chamber[y][x + 2] === true ||
        chamber[y - 1][x + 2] === true
      )
        return rockOrigin;

      chamber[y][x] = false;
      chamber[y][x + 2] = true;

      chamber[y - 1][x] = false;
      chamber[y - 1][x + 2] = true;
      return { y, x: x + 1 };
    }
  }
};

// rock origin is bottom most, left most point
const moveRockDownIfPossible = (
  rockType: RockType,
  rockOrigin: Point,
  chamber: ChamberGrid
): Point => {
  const CHAMBER_HEIGHT = chamber.length;
  switch (rockType) {
    case "dash": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.y === CHAMBER_HEIGHT - 1 ||
        chamber[y + 1][x] === true ||
        chamber[y + 1][x + 1] === true ||
        chamber[y + 1][x + 2] === true ||
        chamber[y + 1][x + 3] === true
      )
        return rockOrigin;

      chamber[y][x] = false;
      chamber[y][x + 1] = false;
      chamber[y][x + 2] = false;
      chamber[y][x + 3] = false;

      chamber[y + 1][x] = true;
      chamber[y + 1][x + 1] = true;
      chamber[y + 1][x + 2] = true;
      chamber[y + 1][x + 3] = true;
      return { y: y + 1, x };
    }
    case "plus": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.y === CHAMBER_HEIGHT - 1 ||
        chamber[y + 1][x] === true ||
        chamber[y][x - 1] === true ||
        chamber[y][x + 1] === true
      )
        return rockOrigin;

      chamber[y - 1][x - 1] = false;
      chamber[y][x - 1] = true;

      chamber[y - 2][x] = false;
      chamber[y + 1][x] = true;

      chamber[y - 1][x + 1] = false;
      chamber[y][x + 1] = true;

      return { y: y + 1, x };
    }
    case "back-l": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.y === CHAMBER_HEIGHT - 1 ||
        chamber[y + 1][x] === true ||
        chamber[y + 1][x + 1] === true ||
        chamber[y + 1][x + 2] === true
      )
        return rockOrigin;

      chamber[y][x] = false;
      chamber[y + 1][x] = true;

      chamber[y][x + 1] = false;
      chamber[y + 1][x + 1] = true;

      chamber[y - 2][x + 2] = false;
      chamber[y + 1][x + 2] = true;
      return { y: y + 1, x };
    }
    case "pipe": {
      const { x, y } = rockOrigin;
      if (rockOrigin.y === CHAMBER_HEIGHT - 1 || chamber[y + 1][x] === true)
        return rockOrigin;

      chamber[y - 3][x] = false;
      chamber[y + 1][x] = true;
      return { y: y + 1, x };
    }
    case "square": {
      const { x, y } = rockOrigin;
      if (
        rockOrigin.y === CHAMBER_HEIGHT - 1 ||
        chamber[y + 1][x] === true ||
        chamber[y + 1][x + 1] === true
      )
        return rockOrigin;

      chamber[y - 1][x] = false;
      chamber[y + 1][x] = true;

      chamber[y - 1][x + 1] = false;
      chamber[y + 1][x + 1] = true;
      return { y: y + 1, x };
    }
  }
};

const encodeCycleParams = (rockIndex: number, cycleIndex: number) =>
  `${rockIndex}-${cycleIndex}`;

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const buildChamber = (
      rockCount: number
    ): {
      maxHeightOfTower: number;
    } => {
      const jetStreamPattern = data.split("");
      const nextRocks: RockType[] = [
        "dash",
        "plus",
        "back-l",
        "pipe",
        "square",
      ];

      const chamber: ChamberGrid = [];

      const totalRocksToFall = rockCount;
      let rocksFallen = 0;
      let jetStreamMoves = 0;

      let currentTowerHeight = 0;
      let towerHeightFilledInByRepitition = 0;
      const observedCycles: {
        [key: string]: { rockCount: number; heightOfTower: number };
      } = {};

      while (rocksFallen < totalRocksToFall) {
        // console.log(rocksFallen);
        const rock = nextRocks[rocksFallen % nextRocks.length];

        let rockOrigin = addRockToChamber(rock, chamber);
        let rockFalling = true;

        while (rockFalling) {
          let pushingWind =
            jetStreamPattern[jetStreamMoves % jetStreamPattern.length];
          jetStreamMoves += 1;

          if (pushingWind === "<") {
            rockOrigin = moveRockLeftIfPossible(rock, rockOrigin, chamber);
          } else if (pushingWind === ">") {
            rockOrigin = moveRockRightIfPossible(rock, rockOrigin, chamber);
          } else {
            throw new Error("Unknown wind type");
          }

          let originalYCoordinate = rockOrigin.y;
          rockOrigin = moveRockDownIfPossible(rock, rockOrigin, chamber);
          if (rockOrigin.y === originalYCoordinate) {
            rockFalling = false;
          }
        }

        rocksFallen += 1;
        currentTowerHeight =
          chamber.length - getHightestRockInChamber(chamber)!;

        const keyOfPatternStep = encodeCycleParams(
          rocksFallen % nextRocks.length,
          jetStreamMoves % jetStreamPattern.length
        );
        if (
          rocksFallen > 10000 &&
          observedCycles[keyOfPatternStep] &&
          towerHeightFilledInByRepitition === 0
        ) {
          const currentRockCount = rocksFallen;
          const {
            rockCount: previousRockCount,
            heightOfTower: previousTowerHeight,
          } = observedCycles[keyOfPatternStep];
          const changeInRocksFallen = currentRockCount - previousRockCount;
          const changeInTowerHeightInCycle =
            currentTowerHeight - previousTowerHeight;

          const remainingRocksToFall = totalRocksToFall - currentRockCount;
          const cycleCount = Math.floor(
            remainingRocksToFall / changeInRocksFallen
          );

          const totalChangeInTowerHeight =
            cycleCount * changeInTowerHeightInCycle;
          towerHeightFilledInByRepitition = totalChangeInTowerHeight;
          rocksFallen = currentRockCount + cycleCount * changeInRocksFallen;
        }
        observedCycles[keyOfPatternStep] = {
          rockCount: rocksFallen,
          heightOfTower: currentTowerHeight + towerHeightFilledInByRepitition,
        };
      }

      return {
        maxHeightOfTower: currentTowerHeight + towerHeightFilledInByRepitition,
      };
    };

    const { maxHeightOfTower: part1Solution } = buildChamber(2022);
    console.log("Part 1 Solution:", part1Solution);
    const { maxHeightOfTower: part2Solution } = buildChamber(1000000000000);
    console.log("Part 2 Solution:", part2Solution);
  }
);
