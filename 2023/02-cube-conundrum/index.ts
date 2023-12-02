import path from "path";
import fs from "fs";

interface Game {
  id: number;
  rounds: GameRound[];
}

interface GameRound {
  red: number;
  blue: number;
  green: number;
}

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const rawGames = data.split("\n");

    const games: Game[] = rawGames.map((rawGame) => {
      const gameIdString = rawGame.split(": ")[0];
      const roundsString = rawGame.split(": ")[1];

      const id = parseInt(gameIdString.split(" ")[1]);
      const rounds: GameRound[] = roundsString
        .split("; ")
        .map((roundString) => {
          let green = 0;
          let blue = 0;
          let red = 0;
          roundString.split(", ").forEach((colorString) => {
            const colorVal = parseInt(colorString.split(" ")[0], 10);
            const colorType = colorString.split(" ")[1];

            if (colorType === "red") {
              red = colorVal;
            } else if (colorType === "blue") {
              blue = colorVal;
            } else if (colorType === "green") {
              green = colorVal;
            }
          });
          return {
            red,
            blue,
            green,
          };
        });
      return {
        id,
        rounds,
      };
    });

    const maxGameRoundSizePartOne: GameRound = {
      red: 12,
      green: 13,
      blue: 14,
    };

    const legalGames = games.filter((game) => {
      const { rounds } = game;
      const hasIllegalRound = rounds.some((round) => {
        if (
          round.red > maxGameRoundSizePartOne.red ||
          round.blue > maxGameRoundSizePartOne.blue ||
          round.green > maxGameRoundSizePartOne.green
        ) {
          return true;
        }
      });
      return !hasIllegalRound;
    });

    console.log(
      "Part 1 Solution -",
      legalGames.map((game) => game.id).reduce((acc, curr) => acc + curr, 0)
    );

    const minimumGameRoundSizes = games.map((game) => {
      let minimumRound: GameRound = {
        red: 0,
        blue: 0,
        green: 0,
      };

      game.rounds.forEach((round) => {
        minimumRound = {
          red: Math.max(minimumRound.red, round.red),
          blue: Math.max(minimumRound.blue, round.blue),
          green: Math.max(minimumRound.green, round.green),
        };
      });

      return minimumRound;
    });

    const gamePowers = minimumGameRoundSizes.map((minimumGameRoundSize) => {
      const { red, blue, green } = minimumGameRoundSize;
      return red * blue * green;
    });

    console.log(
      "Part 2 Solution -",
      gamePowers.reduce((acc, curr) => acc + curr, 0)
    );
  }
);
