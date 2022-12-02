const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const games = data.split("\n");

  const totalScorePart1 = games.reduce(
    (acc, curr) => acc + processGameForScorePart1(curr),
    0
  );
  console.log("Part 1 Solution: ", totalScorePart1);

  const totalScorePart2 = games.reduce(
    (acc, curr) => acc + processGameForScorePart2(curr),
    0
  );
  console.log("Part 2 Solution: ", totalScorePart2);
});

const processGameForScorePart1 = (game) => {
  const [opponentMove, myMove] = game.split(" ");
  let score = 0;
  switch (myMove) {
    case "X":
      score += 1;
      break;
    case "Y":
      score += 2;
      break;
    case "Z":
      score += 3;
      break;
  }

  if (
    (opponentMove === "A" && myMove === "Y") ||
    (opponentMove === "B" && myMove === "Z") ||
    (opponentMove === "C" && myMove === "X")
  ) {
    score += 6;
  }

  if (
    (opponentMove === "A" && myMove === "X") ||
    (opponentMove === "B" && myMove === "Y") ||
    (opponentMove === "C" && myMove === "Z")
  ) {
    score += 3;
  }

  if (
    (opponentMove === "A" && myMove === "Z") ||
    (opponentMove === "B" && myMove === "X") ||
    (opponentMove === "C" && myMove === "Y")
  ) {
    score += 0;
  }

  return score;
};

const processGameForScorePart2 = (game) => {
  const [opponentMove, myResult] = game.split(" ");
  let score = 0;
  switch (myResult) {
    case "X":
      score += 0;
      break;
    case "Y":
      score += 3;
      break;
    case "Z":
      score += 6;
      break;
  }

  // I play rock
  if (
    (opponentMove === "A" && myResult === "Y") ||
    (opponentMove === "C" && myResult === "Z") ||
    (opponentMove === "B" && myResult === "X")
  ) {
    score += 1;
  }

  // I play paper
  if (
    (opponentMove === "C" && myResult === "X") ||
    (opponentMove === "B" && myResult === "Y") ||
    (opponentMove === "A" && myResult === "Z")
  ) {
    score += 2;
  }

  // I play scissors
  if (
    (opponentMove === "A" && myResult === "X") ||
    (opponentMove === "B" && myResult === "Z") ||
    (opponentMove === "C" && myResult === "Y")
  ) {
    score += 3;
  }

  return score;
};
