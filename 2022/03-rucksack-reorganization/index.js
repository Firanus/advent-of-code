const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const rucksacks = data.split("\n");

  const matchingItemsInRucksacks = rucksacks.map(
    getMatchingCharactersForRucksack
  );

  const rucksackGroups = [];
  const chunkSize = 3;
  for (let i = 0; i < rucksacks.length; i += chunkSize) {
    const chunk = rucksacks.slice(i, i + chunkSize);
    rucksackGroups.push(chunk);
  }
  const matchingItemsAcrossGroups = rucksackGroups.map(
    getMatchingCharactersAcrossGroup
  );

  const priorityScoresPart1 = matchingItemsInRucksacks.map(
    getPriorityScoreForCharacter
  );
  const totalScorePart1 = priorityScoresPart1.reduce(
    (acc, curr) => acc + curr,
    0
  );

  const priorityScoresPart2 = matchingItemsAcrossGroups.map(
    getPriorityScoreForCharacter
  );
  const totalScorePart2 = priorityScoresPart2.reduce(
    (acc, curr) => acc + curr,
    0
  );

  console.log("Part 1 Answer:", totalScorePart1);
  console.log("Part 1 Answer:", totalScorePart2);
});

const getMatchingCharactersForRucksack = (rucksack) => {
  const compartmentSize = rucksack.length / 2;
  const leftCompartment = rucksack.slice(0, compartmentSize);
  const rightCompartment = rucksack.slice(compartmentSize);
  const matchingItem = leftCompartment
    .split("")
    .find((l) => rightCompartment.indexOf(l) > -1);
  return matchingItem;
};

const getMatchingCharactersAcrossGroup = (rucksackGroup) => {
  const matchingItem = rucksackGroup[0]
    .split("")
    .find(
      (l) =>
        rucksackGroup[1].indexOf(l) > -1 && rucksackGroup[2].indexOf(l) > -1
    );
  return matchingItem;
};

const getPriorityScoreForCharacter = (character) => {
  const isUppercase = character.toUpperCase() === character;
  const characterCode = character.charCodeAt(0);

  const asciiOffset = isUppercase ? 64 : 96;
  const position = characterCode - asciiOffset;

  return isUppercase ? position + 26 : position;
};
