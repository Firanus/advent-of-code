// Test input
// const playerOneStartPos = 4;
// const playerTwoStartPos = 8;

// Real input
const playerOneStartPos = 1;
const playerTwoStartPos = 5;

let nextDiceRoll = 0;
let numberOfRolls = 0;
const getNextDiceRoll = () => {
  numberOfRolls += 1;
  nextDiceRoll += 1;
  if (nextDiceRoll > 100) {
    nextDiceRoll -= 100;
  }
  return nextDiceRoll;
};

let playerOneScore = 0;
let playerTwoScore = 0;
let playerOnePos = playerOneStartPos;
let playerTwoPos = playerTwoStartPos;

var isPlayerOneNext = true;
while (playerOneScore < 1000 && playerTwoScore < 1000) {
  const positionIncrease =
    getNextDiceRoll() + getNextDiceRoll() + getNextDiceRoll();
  if (isPlayerOneNext) {
    playerOnePos += positionIncrease;
    playerOnePos = playerOnePos % 10;
    playerOneScore += playerOnePos === 0 ? 10 : playerOnePos;
    isPlayerOneNext = false;
  } else {
    playerTwoPos += positionIncrease;
    playerTwoPos = playerTwoPos % 10;
    playerTwoScore += playerTwoPos === 0 ? 10 : playerTwoPos;
    isPlayerOneNext = true;
  }
}

console.log(playerOneScore);
console.log(playerTwoScore);
console.log(numberOfRolls);

console.log(
  numberOfRolls *
    (playerOneScore > playerTwoScore ? playerTwoScore : playerOneScore)
);
