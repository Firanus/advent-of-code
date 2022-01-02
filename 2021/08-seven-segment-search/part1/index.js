const path = require("path");
const fs = require('fs')

fs.readFile(path.resolve(__dirname, '../input.txt'), 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  const results = data.split('\n');
  const splitResults = results.reduce((acc, curr) => {
    const processed = curr.split(' | ');
    acc.signals.push(processed[0].split(' '));
    acc.outputs.push(processed[1].split(' '));

    return acc;
  }, {signals: [], outputs: []});
  
  let uniqueCount = 0;
  for (let i = 0; i < splitResults.outputs.length; i++) {
    for (let j = 0; j < splitResults.outputs[i].length; j++) {
      if (
        splitResults.outputs[i][j].length == 2 || 
        splitResults.outputs[i][j].length == 3 ||
        splitResults.outputs[i][j].length == 4 ||
        splitResults.outputs[i][j].length == 7
      ) {
        uniqueCount += 1
      }
    }
  }
  console.log(uniqueCount)
})