const path = require("path");
const fs = require('fs')
const uuid = require("uuid")

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
        // Label the low-point
        grid[i][j] = uuid.v4()
      }
    }
  }

  let requiresAnotherPass = true;

  // Label points on grid until either all labelled or 9
  while (requiresAnotherPass) {
    requiresAnotherPass = false;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        let value = grid[i][j];
        
        // Points already labelled
        if (value === 9 || typeof value === 'string') {
          continue;
        }

        let above = i > 0 ? grid[i - 1][j] : undefined;
        let below = i < grid.length - 1 ? grid[i + 1][j] : undefined;
        let left = j > 0 ? grid[i][j - 1] : undefined;
        let right = j < grid[i].length ? grid[i][j + 1] : undefined;

        if (typeof above === 'string') {
          grid[i][j] = above;
        } else if (typeof below === 'string') {
          grid[i][j] = below;
        } else if (typeof left === 'string') {
          grid[i][j] = left;
        } else if (typeof right === 'string') {
          grid[i][j] = right;
        } else {
          // unlabelled values mean we need another pass
          requiresAnotherPass = true;
        }
      }
    }
  }

  let basins = {}
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let value = grid[i][j];
      if (value === 9) {
        continue;
      }

      let existingBasinSize = basins[value] ?? 0;
      basins[value] = existingBasinSize += 1
    }
  }

  const orderedBasinSizes = Object.values(basins).sort((a, b) => a > b ? -1 : 1);
  const result = orderedBasinSizes.slice(0,3).reduce((acc, curr) => acc * curr, 1);
  console.log(result)
})