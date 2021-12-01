const path = require("path");
const fs = require('fs')

fs.readFile(path.resolve(__dirname, '../input.txt'), 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const depths = data.split('\n').map(x => parseInt(x, 10));
  const increaseCount = depths.reduce((acc, curr) => {
      if (acc.previousValues.length < 3) {
          acc.previousValues.push(curr);
          return acc;
      }

      const lastSum = acc.previousValues.reduce((acc, curr) => acc + curr, 0);
      acc.previousValues.shift();
      acc.previousValues.push(curr);
      const currentSum = acc.previousValues.reduce((acc, curr) => acc + curr, 0);

      if (currentSum > lastSum) {
          acc.count += 1;
      }

      return acc;
  }, {count: 0, previousValues: []});

  console.log(increaseCount.count);
})