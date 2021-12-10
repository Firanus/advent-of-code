const path = require("path");
const fs = require('fs')

fs.readFile(path.resolve(__dirname, './input.txt'), 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  let corruptedRowCharacters = [];
  let completionStrings = [];
  const inputs = data.split('\n');
  inputs.forEach(input => {
    const charArray = input.split('');
    const openedChunksStack = [];
    let isRowCorrupted = false;
    for (let i = 0; i < charArray.length; i++) {
      const char = charArray[i];
      if (isInputCharacter(char)) {
        openedChunksStack.push(char);
        continue;
      }

      const expectedOpeningCharacter = openedChunksStack.pop();
      const validMatch = closingCharacters[expectedOpeningCharacter] === char;

      if (!validMatch) {
        // Row is corrupted, stop.
        corruptedRowCharacters.push(char);
        isRowCorrupted = true;
        break;
      }
    }

    if(!isRowCorrupted) {
      // Anything left in the openedChunksStack is our incomplete set.
      let completionString = ''
      while(openedChunksStack.length > 0) {
        completionString += closingCharacters[openedChunksStack.pop()];
      }
      completionStrings.push(completionString);
    }
  })

  const part1Score = corruptedRowCharacters.reduce((acc, curr) => acc + corruptedCharacterScores[curr], 0);
  console.log(`Score for Part 1: ${part1Score}`);
  
  const part2Scores = completionStrings.map(str => scoreCompletionString(str)).sort((a, b) => a < b ? -1 : 1);
  
  // We are told array always has odd number of elements
  const part2FinalScore = part2Scores[(part2Scores.length - 1) / 2];
  console.log(`Score for Part 2: ${part2FinalScore}`);
})

const isInputCharacter = (char) => {
  return char === '{' || char === '(' || char === '[' || char === '<';
}

const closingCharacters = {
  ['{']: '}',
  ['(']: ')',
  ['[']: ']',
  ['<']: '>',
};

const corruptedCharacterScores = {
  ['}']: 1197,
  [')']: 3,
  [']']: 57,
  ['>']: 25137,
}

const scoreCompletionString = (str) => {
  let score = 0;
  let charArray = str.split('');
  for (let i = 0; i < charArray.length; i++) {
    const char = charArray[i];
    let charValue = completionStringCharacterScores[char];
    score = (score * 5) + charValue;
  }
  return score;
}

const completionStringCharacterScores = {
  ['}']: 3,
  [')']: 1,
  [']']: 2,
  ['>']: 4,
}
