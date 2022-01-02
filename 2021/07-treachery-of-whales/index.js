const path = require("path");
const fs = require('fs')

// Turns out you can just do n * (n+1) / 2
// But this got me the answer in no time, so screw it.
const getTriangleNumber = (num) => {
  let sum = 0
  for (let i = 1; i <= num; i++) {
    sum += i
  }
  return sum;
}

fs.readFile(path.resolve(__dirname, './input.txt'), 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  // const horizontalPositions = [16,1,2,0,4,2,7,1,2,14]
  const horizontalPositions = data.split(',').map(x => parseInt(x, 10));
  const minPosition = Math.min(...horizontalPositions);
  const maxPosition = Math.max(...horizontalPositions);

  const movementCounts = [];
  for (let i = minPosition; i <= maxPosition; i++) {
    let currentCount = 0
    for (let j = 0; j < horizontalPositions.length; j++) {
      // Remove call to getTriangleNumber for Part 1
      currentCount += getTriangleNumber(Math.abs((horizontalPositions[j]) - i))
    }
    movementCounts.push(currentCount)
  }
  console.log(Math.min(...movementCounts))
})