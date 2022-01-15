const path = require("path");
const fs = require("fs");

const shouldNegateWithCount = (
  indexToCheck,
  negatedCharCount,
  streamByCharacters
) => {
  if (indexToCheck < 0 || streamByCharacters[indexToCheck] !== "!") {
    return {
      shouldNegate: false,
      negatedCharCount,
    };
  }

  const result = shouldNegateWithCount(
    indexToCheck - 1,
    negatedCharCount + 1,
    streamByCharacters
  );
  return {
    shouldNegate: !result.shouldNegate,
    negatedCharCount: result.negatedCharCount,
  };
};

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const stream = data;
  const streamByCharacters = stream.split("");

  let currentDepth = 0;
  let score = 0;
  let nonCanceledCharactersInGarbage = 0;
  let inGarbage = false;

  for (let i = 0; i < streamByCharacters.length; i++) {
    const currentChar = streamByCharacters[i];
    let negated = false;
    let negatedCharCount = 0;

    if (currentChar !== "!") {
      const negationResult = shouldNegateWithCount(
        i - 1,
        0,
        streamByCharacters
      );
      negated = negationResult.shouldNegate;
      negatedCharCount = negationResult.negatedCharCount;
    }

    if (inGarbage) {
      nonCanceledCharactersInGarbage -= negatedCharCount;
    }

    if (negated) {
      continue;
    }

    if (inGarbage && currentChar !== ">") {
      nonCanceledCharactersInGarbage += 1;
      continue;
    }

    if (currentChar === ">") {
      inGarbage = false;
    } else if (currentChar === "<") {
      inGarbage = true;
    } else if (currentChar === "{") {
      currentDepth += 1;
    } else if (currentChar === "}") {
      score += currentDepth;
      currentDepth--;
    }
  }

  console.log("Part 1 Answer:", score);
  console.log("Part 2 Answer:", nonCanceledCharactersInGarbage);
});
