const inputMinimum = 387638;
const inputMaximum = 919123;

let numberOfPossiblePasswordsPart1 = 0;
let numberOfPossiblePasswordsPart2 = 0;
for (let i = inputMinimum; i <= inputMaximum; i++) {
  let hasMatchingAdjacentDigits = false;
  let hasExactlyTwoMatchingAdjacentDigits = false;
  let hasNoDecreasingDigits = true;

  const stringNum = i.toString();
  for (let j = 1; j < stringNum.length; j++) {
    const firstDigit = stringNum[j - 1];
    const secondDigit = stringNum[j];

    if (firstDigit === secondDigit) {
      hasMatchingAdjacentDigits = true;

      let precedingDigit;
      let succeedingDigit;
      if (j === 1) {
        succeedingDigit = stringNum[j + 1];
      } else if (j === stringNum.length - 1) {
        precedingDigit = stringNum[j - 2];
      } else {
        precedingDigit = stringNum[j - 2];
        succeedingDigit = stringNum[j + 1];
      }

      const precedingMatch = precedingDigit === firstDigit;
      const succeedingMatch = succeedingDigit === secondDigit;
      if (!precedingMatch && !succeedingMatch) {
        hasExactlyTwoMatchingAdjacentDigits = true;
      }
    }

    if (parseInt(secondDigit, 10) < parseInt(firstDigit, 10)) {
      hasNoDecreasingDigits = false;
    }
  }

  if (hasMatchingAdjacentDigits && hasNoDecreasingDigits) {
    numberOfPossiblePasswordsPart1 += 1;
  }
  if (hasExactlyTwoMatchingAdjacentDigits && hasNoDecreasingDigits) {
    numberOfPossiblePasswordsPart2 += 1;
  }
}

console.log("Part 1 Answer: ", numberOfPossiblePasswordsPart1);
console.log("Part 2 Answer: ", numberOfPossiblePasswordsPart2);
