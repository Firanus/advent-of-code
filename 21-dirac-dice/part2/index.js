// Test input
// const playerOneStartPos = 4;
// const playerTwoStartPos = 8;

// Real input
const playerOneStartPos = 1;
const playerTwoStartPos = 5;

// maps of keys to object:
// [score:pos]: {
//    score: number
//    position: number
//    count: number
// }
// After each turn, we check object for any scores greater than 21
// We then remove them, and mark them as wins for the player
// against all remaining rolls for the other player.

var playerOneScores = {
  [`0:${playerOneStartPos}`]: {
    position: playerOneStartPos,
    score: 0,
    count: 1,
  },
};
var playerTwoScores = {
  [`0:${playerTwoStartPos}`]: {
    position: playerTwoStartPos,
    score: 0,
    count: 1,
  },
};

const rollResults = [
  { positionIncrease: 3, countMultiplier: 1 },
  { positionIncrease: 4, countMultiplier: 3 },
  { positionIncrease: 5, countMultiplier: 6 },
  { positionIncrease: 6, countMultiplier: 7 },
  { positionIncrease: 7, countMultiplier: 6 },
  { positionIncrease: 8, countMultiplier: 3 },
  { positionIncrease: 9, countMultiplier: 1 },
];

const genKey = (score, position) => `${score}:${position}`;

const executeTurn = (playerScores) => {
  const newPlayerScores = {};
  Object.values(playerScores).map((playerScore) => {
    for (let i = 0; i < rollResults.length; i++) {
      const { score, position, count } = playerScore;
      const { positionIncrease, countMultiplier } = rollResults[i];

      const newPosition = (position + positionIncrease) % 10;
      const newScore = score + (newPosition === 0 ? 10 : newPosition);

      const newScoreObject = {
        position: newPosition,
        score: newScore,
        count: count * countMultiplier,
      };

      const key = genKey(newScore, newPosition);
      let existingScore = newPlayerScores[key];
      if (existingScore) {
        newScoreObject.count += existingScore.count;
      }
      newPlayerScores[key] = newScoreObject;
    }
  });
  return newPlayerScores;
};

const inProgressGames = (playerScores) =>
  Object.values(playerScores).reduce((acc, curr) => acc + curr.count, 0);

let playerOneWins = 0;
let playerTwoWins = 0;

const updateWinsForPlayerOne = (oneScores, twoScores) => {
  const [newWins, newScores] = getNewWins(oneScores, twoScores);
  playerOneWins += newWins;
  return newScores;
};

const updateWinsForPlayerTwo = (oneScores, twoScores) => {
  const [newWins, newScores] = getNewWins(twoScores, oneScores);
  playerTwoWins += newWins;
  return newScores;
};

const getNewWins = (playerWhoJustWentScores, otherPlayerScores) => {
  const otherPlayerGamesInProgress = inProgressGames(otherPlayerScores);
  let remainingScores = {};
  const scores = Object.values(playerWhoJustWentScores);

  let newWins = 0;
  for (let i = 0; i < scores.length; i++) {
    const { score, position, count } = scores[i];
    if (score < 21) {
      remainingScores[genKey(score, position)] = scores[i];
      continue;
    }

    newWins += count * otherPlayerGamesInProgress;
  }

  return [newWins, remainingScores];
};

var shouldContinue = true;
var isPlayerOneNext = true;

while (shouldContinue) {
  if (isPlayerOneNext) {
    playerOneScores = executeTurn(playerOneScores);
    playerOneScores = updateWinsForPlayerOne(playerOneScores, playerTwoScores);
  } else {
    playerTwoScores = executeTurn(playerTwoScores);
    playerTwoScores = updateWinsForPlayerTwo(playerOneScores, playerTwoScores);
  }

  isPlayerOneNext = !isPlayerOneNext;
  shouldContinue =
    inProgressGames(playerOneScores) > 0 &&
    inProgressGames(playerTwoScores) > 0;
}

console.log(playerOneWins);
console.log(playerTwoWins);
