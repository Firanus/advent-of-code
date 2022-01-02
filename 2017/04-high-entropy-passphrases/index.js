const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const passphrases = data.split("\n").map((row) => row.split(" "));

  const validPhraseCountPart1 = passphrases.reduce(
    (acc, curr) => acc + (phraseContainsDuplicate(curr) ? 0 : 1),
    0
  );

  const validPhraseCountPart2 = passphrases.reduce(
    (acc, curr) => acc + (phraseContainsAnagram(curr) ? 0 : 1),
    0
  );

  console.log("Part 1 Answer:", validPhraseCountPart1);
  console.log("Part 2 Answer:", validPhraseCountPart2);
});

const phraseContainsDuplicate = (phrase) => {
  const seenWords = {};

  for (let i = 0; i < phrase.length; i++) {
    const word = phrase[i];
    if (seenWords[word]) {
      return true;
    }

    seenWords[word] = true;
  }

  return false;
};

const phraseContainsAnagram = (phrase) => {
  const seenAnagrams = {};

  for (let i = 0; i < phrase.length; i++) {
    const word = phrase[i];
    const anagram = word.split("").sort().join("");
    if (seenAnagrams[anagram]) {
      return true;
    }

    seenAnagrams[anagram] = true;
  }

  return false;
};
