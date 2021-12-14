const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const [initialTemplateInput, pairInsertionRulesInput] = data.split("\n\n");

  // Structured so that one pair creates two new ones. E.g.
  // {
  //    'CH': ['CB', 'BH']
  //    ...
  // }
  const pairInsertionRules = {};
  const pairInsertionRulesStrings = pairInsertionRulesInput.split("\n");
  for (let i = 0; i < pairInsertionRulesStrings.length; i++) {
    const rule = pairInsertionRulesStrings[i];
    const [startPair, addedCharacter] = rule.split(" -> ");
    const [firstChar, lastChar] = startPair.split("");
    pairInsertionRules[startPair] = [
      firstChar + addedCharacter,
      addedCharacter + lastChar,
    ];
  }

  // Template stored as a count of pairs. E.g.
  // {
  //    'CH': 1
  //    // ..
  // }
  let currentTemplate = {};
  const initialTemplateChars = initialTemplateInput.split("");
  for (let i = 1; i < initialTemplateChars.length; i++) {
    const previousChar = initialTemplateChars[i - 1];
    const currentChar = initialTemplateChars[i];
    const pair = previousChar + currentChar;
    currentTemplate[pair] = currentTemplate[pair]
      ? currentTemplate[pair] + 1
      : 1;
  }

  // We'll also maintain counts of each character to solve the puzzle input
  const characterCounts = {};
  for (let i = 0; i < initialTemplateChars.length; i++) {
    const char = initialTemplateChars[i];
    characterCounts[char] = characterCounts[char]
      ? characterCounts[char] + 1
      : 1;
  }

  for (let i = 0; i < 40; i++) {
    currentTemplate = expandTemplate(
      currentTemplate,
      pairInsertionRules,
      characterCounts
    );
  }

  const characterCountValues = Object.values(characterCounts).sort((a, b) =>
    a < b ? -1 : 1
  );
  const result =
    characterCountValues[characterCountValues.length - 1] -
    characterCountValues[0];
  console.log(result);
});

const expandTemplate = (
  currentTemplate,
  pairInsertionRules,
  characterCounts
) => {
  const newTemplate = {};
  const existingPairs = Object.keys(currentTemplate);
  for (let i = 0; i < existingPairs.length; i++) {
    const pair = existingPairs[i];
    const currentPairCount = currentTemplate[pair];
    const newlyCreatedPairs = pairInsertionRules[pair];

    for (let j = 0; j < newlyCreatedPairs.length; j++) {
      const newPair = newlyCreatedPairs[j];
      newTemplate[newPair] = newTemplate[newPair]
        ? newTemplate[newPair] + currentPairCount
        : currentPairCount;
    }

    const newCharacter = newlyCreatedPairs[0].split("")[1];
    characterCounts[newCharacter] = characterCounts[newCharacter]
      ? characterCounts[newCharacter] + currentPairCount
      : currentPairCount;
  }

  return newTemplate;
};
