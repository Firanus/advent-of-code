const path = require("path");
const fs = require('fs')

fs.readFile(path.resolve(__dirname, '../input.txt'), 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  let grid = []
  const rows = data.split('\n');
  rows.forEach(rowString => {
    let row = rowString.split('').map(x => parseInt(x))
    grid.push(row)
  })
  
  let lowPoints = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let value = grid[i][j];
      let above = i > 0 ? grid[i - 1][j] : undefined;
      let below = i < grid.length - 1 ? grid[i + 1][j] : undefined;
      let left = j > 0 ? grid[i][j - 1] : undefined;
      let right = j < grid[i].length ? grid[i][j + 1] : undefined;

      if (
        (left === undefined || value < left) &&
        (right === undefined || value < right) &&
        (above === undefined  || value < above) &&
        (below === undefined || value < below)
      ) {
        lowPoints.push(value);
      }
    }
  }

  const riskFactor = lowPoints.reduce((acc, curr) => acc + curr, 0) + lowPoints.length;
  console.log(lowPoints)
  console.log(riskFactor)
})