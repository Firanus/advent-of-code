// ------------------------------------------------------
// Inputs
// ------------------------------------------------------

// Real input
const initialMemoryBanks = "10	3	15	10	5	15	5	15	9	2	5	8	5	2	3	6";

// Test input
// const initialMemoryBanks = "0 2 7 0";

// ------------------------------------------------------
// Supporting Functions
// ------------------------------------------------------

const key = (memoryBanks) => memoryBanks.join("-");
const findIndexOfMax = (memoryBanks) => {
  let indexOfMax = -1;
  let currentMax = -1;
  for (let i = 0; i < memoryBanks.length; i++) {
    const max = Math.max(memoryBanks[i], currentMax);
    if (max > currentMax) {
      currentMax = max;
      indexOfMax = i;
    }
  }

  return indexOfMax;
};

// ------------------------------------------------------
// Start of Algorithm
// ------------------------------------------------------

let memoryBanks = initialMemoryBanks.split(/\s+/).map((x) => parseInt(x));
let hasDuplicateBeenDetected = false;
let stepCount = 0;

const previouslySeenMemoryBanks = { [key(memoryBanks)]: 0 };

while (!hasDuplicateBeenDetected) {
  stepCount += 1;

  const indexOfMax = findIndexOfMax(memoryBanks);
  let banksToAllocate = memoryBanks[indexOfMax];
  let nextIndexToBump =
    indexOfMax === memoryBanks.length - 1 ? 0 : indexOfMax + 1;

  memoryBanks[indexOfMax] = 0;

  while (banksToAllocate > 0) {
    memoryBanks[nextIndexToBump] += 1;
    nextIndexToBump =
      nextIndexToBump === memoryBanks.length - 1 ? 0 : nextIndexToBump + 1;
    banksToAllocate -= 1;
  }

  if (previouslySeenMemoryBanks[key(memoryBanks)] !== undefined) {
    hasDuplicateBeenDetected = true;
  } else {
    previouslySeenMemoryBanks[key(memoryBanks)] = stepCount;
  }
}

console.log("Part 1 Answer:", stepCount);

const stepOfLastSighting = previouslySeenMemoryBanks[key(memoryBanks)];
console.log("Part 2 Answer:", stepCount - stepOfLastSighting);
