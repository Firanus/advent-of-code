const path = require("path");
const fs = require('fs')

fs.readFile(path.resolve(__dirname, '../input.txt'), 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const depths = data.split('\n').map(x => parseInt(x, 10));
  const increaseCount = depths.reduce((acc, curr) => {
      if (acc.previousValue === undefined) {
          acc.previousValue = curr;
          return acc;
      }

      if (curr > acc.previousValue) {
          acc.count += 1;
      }

      acc.previousValue = curr;
      return acc;
  }, {count: 0, previousValue: undefined});

  console.log(increaseCount.count);
})