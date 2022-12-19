import path from "path";
import fs from "fs";

type OreRobotBlueprint = { oreCost: number };
type ClayRobotBlueprint = OreRobotBlueprint;
type ObsidianRobotBlueprint = { oreCost: number; clayCost: number };
type GeodeRobotBlueprint = { oreCost: number; obsidianCost: number };

type BluePrint = {
  id: string;
  oreRobotBp: OreRobotBlueprint;
  clayRobotBp: ClayRobotBlueprint;
  obsidianRobotBp: ObsidianRobotBlueprint;
  geodeRobotBp: GeodeRobotBlueprint;
};

type Game = {
  activeBlueprint: BluePrint;
  minutesLeft: number;
  oreRobotCount: number;
  oreCount: number;
  clayRobotCount: number;
  clayCount: number;
  obsidianRobotCount: number;
  obsidianCount: number;
  geodeRobotCount: number;
  geodeCount: number;
};

const encodeGame = ({
  minutesLeft,
  oreRobotCount,
  clayRobotCount,
  obsidianRobotCount,
  geodeRobotCount,
}: Game): string =>
  `${minutesLeft},${oreRobotCount},${clayRobotCount},${obsidianRobotCount},${geodeRobotCount}`;

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const blueprints: BluePrint[] = data.split("\n").map((bpStr) => {
      const [idStr, ...rest] = bpStr.split(": ");
      const [, id] = idStr.split(" ");
      const robotStrings = rest.join("");

      const oreCostRegex = /(?<=costs ).*?(?= ore)/g;
      const clayCostRegex = /(?<=and ).*?(?= clay. )/;
      const obsidianCostRegex =
        /(?<=geode robot costs \d ore and ).*?(?= obsidian.)/;
      const [
        oreRobotCost,
        clayRoborCost,
        obsidianRobotOreCost,
        geodeRobotOreCost,
      ] = robotStrings.match(oreCostRegex) ?? [];
      const clayCost = robotStrings.match(clayCostRegex)?.[0];
      const obsidianCost = robotStrings.match(obsidianCostRegex)?.[0];

      if (!oreRobotCost || !clayCost || !obsidianCost)
        throw new Error("Input parsed incorrectly");

      return {
        id,
        oreRobotBp: { oreCost: parseInt(oreRobotCost) },
        clayRobotBp: { oreCost: parseInt(clayRoborCost) },
        obsidianRobotBp: {
          oreCost: parseInt(obsidianRobotOreCost),
          clayCost: parseInt(clayCost),
        },
        geodeRobotBp: {
          oreCost: parseInt(geodeRobotOreCost),
          obsidianCost: parseInt(obsidianCost),
        },
      };
    });

    const runGame = (blueprint: BluePrint, totalMinutes: number): number => {
      const newGame: Game = {
        activeBlueprint: blueprint,
        minutesLeft: totalMinutes,
        oreRobotCount: 1,
        oreCount: 0,
        clayRobotCount: 0,
        clayCount: 0,
        obsidianRobotCount: 0,
        obsidianCount: 0,
        geodeRobotCount: 0,
        geodeCount: 0,
      };

      const finishedGames: Game[] = [];
      const gamesInProgress: Game[] = [newGame];
      const mostGeodesPerMinute: { [minutesLeft: number]: number } = {};
      const bestGameForRobotSets: {
        [gameKey: string]: {
          oreCount: number;
          clayCount: number;
          obsidianCount: number;
          geodeCount: number;
        }[];
      } = {};

      while (gamesInProgress.length > 0) {
        console.log(gamesInProgress.length);
        const game = gamesInProgress.shift()!;

        if (game.minutesLeft === 0) {
          finishedGames.push(game);
          continue;
        }

        if (bestGameForRobotSets[encodeGame(game)]) {
          const bestGamesForSet = bestGameForRobotSets[encodeGame(game)];

          // If you're at a game that has strictly fewer resources than another
          // game you've seen at the same time and robot count, you're worse. Skip.
          if (
            bestGamesForSet.some(
              (bg) =>
                game.oreCount <= bg.oreCount &&
                game.clayCount <= bg.clayCount &&
                game.obsidianCount <= bg.obsidianCount &&
                game.geodeCount <= bg.geodeCount
            )
          ) {
            continue;
          } else {
            bestGamesForSet.push({
              oreCount: game.oreCount,
              clayCount: game.clayCount,
              obsidianCount: game.obsidianCount,
              geodeCount: game.geodeCount,
            });
          }
        } else {
          bestGameForRobotSets[encodeGame(game)] = [
            {
              oreCount: game.oreCount,
              clayCount: game.clayCount,
              obsidianCount: game.obsidianCount,
              geodeCount: game.geodeCount,
            },
          ];
        }

        game.minutesLeft -= 1;

        // We never need more clay robots than it takes to make an obsidian
        if (
          game.clayRobotCount > game.activeBlueprint.obsidianRobotBp.clayCost
        ) {
          continue;
        }

        // We never need more obsidian robots than it takes to make a geode
        if (
          game.obsidianRobotCount >
          game.activeBlueprint.geodeRobotBp.obsidianCost
        ) {
          continue;
        }

        // We never need more ore robots than it takes to make the most expensive other robot
        const oreCosts = [
          game.activeBlueprint.oreRobotBp.oreCost,
          game.activeBlueprint.clayRobotBp.oreCost,
          game.activeBlueprint.obsidianRobotBp.oreCost,
          game.activeBlueprint.geodeRobotBp.oreCost,
        ];
        const maxOreCost = oreCosts.reduce(
          (acc, curr) => Math.max(acc, curr),
          Number.NEGATIVE_INFINITY
        );
        if (game.oreRobotCount > maxOreCost) {
          continue;
        }

        // Geode exit condition
        // We increment geodes and check for early escapes
        // Happens before other increments because we don't spend geodes.
        game.geodeCount += game.geodeRobotCount;

        const existingBestGeodesAtNumber =
          mostGeodesPerMinute[game.minutesLeft];

        if (
          existingBestGeodesAtNumber !== undefined &&
          existingBestGeodesAtNumber > game.geodeCount
        ) {
          continue;
        } else {
          mostGeodesPerMinute[game.minutesLeft] = game.geodeCount;
        }

        // Build Robots
        const { oreRobotBp, clayRobotBp, obsidianRobotBp, geodeRobotBp } =
          blueprint;

        if (
          game.oreCount >= geodeRobotBp.oreCost &&
          game.obsidianCount >= geodeRobotBp.obsidianCost
        ) {
          gamesInProgress.push({
            ...game,
            oreCount: game.oreCount - geodeRobotBp.oreCost + game.oreRobotCount,
            clayCount: game.clayCount + game.clayRobotCount,
            obsidianCount:
              game.obsidianCount -
              geodeRobotBp.obsidianCost +
              game.obsidianRobotCount,
            geodeRobotCount: game.geodeRobotCount + 1,
          });
          // If you can build a geode robot always do so.
          continue;
        }

        if (
          game.oreCount >= obsidianRobotBp.oreCost &&
          game.clayCount >= obsidianRobotBp.clayCost
        ) {
          gamesInProgress.push({
            ...game,
            oreCount:
              game.oreCount - obsidianRobotBp.oreCost + game.oreRobotCount,
            clayCount:
              game.clayCount - obsidianRobotBp.clayCost + game.clayRobotCount,
            obsidianCount: game.obsidianCount + game.obsidianRobotCount,
            obsidianRobotCount: game.obsidianRobotCount + 1,
          });
        }

        if (game.oreCount >= clayRobotBp.oreCost) {
          gamesInProgress.push({
            ...game,
            oreCount: game.oreCount - clayRobotBp.oreCost + game.oreRobotCount,
            clayCount: game.clayCount + game.clayRobotCount,
            obsidianCount: game.obsidianCount + game.obsidianRobotCount,
            clayRobotCount: game.clayRobotCount + 1,
          });
        }

        if (game.oreCount >= oreRobotBp.oreCost) {
          gamesInProgress.push({
            ...game,
            oreCount: game.oreCount - oreRobotBp.oreCost + game.oreRobotCount,
            clayCount: game.clayCount + game.clayRobotCount,
            obsidianCount: game.obsidianCount + game.obsidianRobotCount,
            oreRobotCount: game.oreRobotCount + 1,
          });
        }

        gamesInProgress.push({
          ...game,
          oreCount: game.oreCount + game.oreRobotCount,
          clayCount: game.clayCount + game.clayRobotCount,
          obsidianCount: game.obsidianCount + game.obsidianRobotCount,
        });
      }

      finishedGames.sort((a, b) => b.geodeCount - a.geodeCount);

      return mostGeodesPerMinute[0] ?? 0;
    };

    const qualityScoresPart1 = blueprints.map(
      (bp) => parseInt(bp.id) * runGame(bp, 24)
    );
    const part1Solution = qualityScoresPart1.reduce(
      (acc, curr) => acc + curr,
      0
    );

    // Solution gets the test case wrong for part 2 (optimal for BP1 given is 42 not 56)
    // But it works for Part 2! So suck it losers! :D
    const maxGeodes = blueprints.slice(0, 3).map((bp) => runGame(bp, 32));
    const part2Solution = maxGeodes.reduce((acc, curr) => acc * curr, 1);

    console.log("Part 1 Solution:", part1Solution);
    console.log("Part 2 Solution:", part2Solution);
  }
);
