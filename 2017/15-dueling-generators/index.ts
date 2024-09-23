// Test input
// const GENERATOR_A_INPUT = 65;
// const GENERATOR_B_INPUT = 8921;

// Real input
const GENERATOR_A_INPUT = 783;
const GENERATOR_B_INPUT = 325;

const GENERATOR_A_FACTOR = 16807;
const GENERATOR_B_FACTOR = 48271;
const DIVISOR = 2147483647;

const getGeneratorOutput = (input: number, factor: number): number => {
  return (input * factor) % DIVISOR;
};

const getBinaryOutput = (input: number): string => {
  return input.toString(2).padStart(16, "0").slice(-16);
};

const getMatchCount = (isPart2: boolean): number => {
  let generatorAValue = GENERATOR_A_INPUT;
  let generatorBValue = GENERATOR_B_INPUT;
  let matchCount = 0;

  const matchCountLimit = isPart2 ? 5000000 : 40000000;
  for (let i = 0; i < matchCountLimit; i++) {
    if (i % 1000000 === 0) {
      console.log("Iteration", i, "Match count", matchCount);
    }
    generatorAValue = getGeneratorOutput(generatorAValue, GENERATOR_A_FACTOR);
    if (isPart2) {
      while (generatorAValue % 4 !== 0) {
        generatorAValue = getGeneratorOutput(
          generatorAValue,
          GENERATOR_A_FACTOR
        );
      }
    }
    generatorBValue = getGeneratorOutput(generatorBValue, GENERATOR_B_FACTOR);
    if (isPart2) {
      while (generatorBValue % 8 !== 0) {
        generatorBValue = getGeneratorOutput(
          generatorBValue,
          GENERATOR_B_FACTOR
        );
      }
    }

    const binaryA = getBinaryOutput(generatorAValue);
    const binaryB = getBinaryOutput(generatorBValue);

    if (binaryA === binaryB) {
      matchCount++;
    }
  }

  return matchCount;
};

const part1Start = Date.now();
console.log(
  "Part 1 Solution:",
  getMatchCount(false),
  "Runtime:",
  `${Date.now() - part1Start}ms`
);
const part2Start = Date.now();
console.log(
  "Part 2 Solution:",
  getMatchCount(true),
  "Runtime:",
  `${Date.now() - part2Start}ms`
);
