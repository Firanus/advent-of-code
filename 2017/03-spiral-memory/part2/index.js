const puzzleInput = 265149;

const key = (xIndex, yIndex) => `${xIndex}:${yIndex}`;

const getSumOfSurroundingItemsFromMemory = (memory, xIndex, yIndex) => {
  let sum = 0;
  for (let i = xIndex - 1; i <= xIndex + 1; i++) {
    for (let j = yIndex - 1; j <= yIndex + 1; j++) {
      if (i === xIndex && j === yIndex) {
        continue;
      }

      const value = memory[key(i, j)];
      if (value) {
        sum += value;
      }
    }
  }
  return sum;
};

const memoryStructure = { [key(0, 0)]: 1 };

let maxDimension = 0;
let x = 0;
let y = 0;
let largestValue = 1;

while (largestValue < puzzleInput) {
  if (x === maxDimension && y === maxDimension) {
    maxDimension += 1;
    x += 1;
  } else if (x === maxDimension && y !== -maxDimension) {
    y -= 1;
  } else if (y === -maxDimension && x !== -maxDimension) {
    x -= 1;
  } else if (x === -maxDimension && y !== maxDimension) {
    y += 1;
  } else if (y === maxDimension && x !== maxDimension) {
    x += 1;
  }

  const newValue = getSumOfSurroundingItemsFromMemory(memoryStructure, x, y);
  memoryStructure[key(x, y)] = newValue;
  largestValue = Math.max(largestValue, newValue);
}

console.log("Part 2 answer:", largestValue);
