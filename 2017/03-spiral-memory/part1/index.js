const puzzleInput = 265149;

// Calculate value of max in same square as puzzle input
const ceilSqrtInput = Math.ceil(Math.sqrt(puzzleInput));
const widthOfContainingSquare =
  ceilSqrtInput % 2 === 0 ? ceilSqrtInput + 1 : ceilSqrtInput;

const greatestIndexOfContainingSquare = Math.pow(widthOfContainingSquare, 2);

// Find its position
const maxDimension = Math.floor(widthOfContainingSquare / 2);

let xIndex = maxDimension;
let yIndex = maxDimension;

// Starting form there, work out the position of the input

const difference = greatestIndexOfContainingSquare - puzzleInput;

if (difference <= 2 * maxDimension) {
  // On bottom row
  yIndex = maxDimension;
  xIndex -= difference;
} else if (difference > 2 * maxDimension && difference <= 4 * maxDimension) {
  // Left column
  xIndex = -maxDimension;
  yIndex = maxDimension - (difference - 2 * maxDimension);
} else if (difference > 4 * maxDimension && difference <= 6 * maxDimension) {
  // Tow row
  xIndex = -maxDimension + (difference - 4 * maxDimension);
  yIndex = -maxDimension;
} else {
  // Right column
  xIndex = maxDimension;
  yIndex = -maxDimension + (difference - 6 * maxDimension);
}

console.log("Position of input:", xIndex, yIndex);
console.log("Part 1 Answer:", Math.abs(xIndex) + Math.abs(yIndex));
