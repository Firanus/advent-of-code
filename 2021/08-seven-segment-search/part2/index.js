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
  
  const finalResults = []
  for (let i = 0; i < splitResults.outputs.length; i++) {
    const signals = splitResults.signals[i];
    const outputs = splitResults.outputs[i];

    const numbers = determineNumbers(signals);
    const result = processOutputs(outputs, numbers)
    finalResults.push(result);
  }

  const sum = finalResults.reduce((acc, curr) => acc + curr, 0);
  console.log(sum);
})

// Numbers has structure of getNumbers function below
const processOutputs = (outputs, numbers) => {
  let result = ''
  
  outputs.forEach((output) => result += getNumberForOutput(output, numbers))

  return parseInt(result);
}

const getNumberForOutput = (output, numbers) => {
  for (let i = 0; i < numbers.length; i++) {
    if (output.length === numbers[i].length && output.split('').every(charInOutput => numbers[i].includes(charInOutput))) {
      return `${i}`;
      break;
    }
  }
  throw new Error("Got a number we didn't understand");
}

// Return is an array of the strings where the index in the array is
// the number the string represents
const determineNumbers = (signals) => {
  const one = signals.filter(signal => signal.length == 2)[0];
  const four = signals.filter(signal => signal.length == 4)[0];
  const seven = signals.filter(signal => signal.length == 3)[0];
  const eight = signals.filter(signal => signal.length == 7)[0];

  // 2, 3, 5
  const numbersWithFiveLines = signals.filter(signal => signal.length == 5)
  // 0, 6, 9
  const numbersWithSixLines = signals.filter(signal => signal.length == 6)

  // 6 only six liner without both elements in 1
  const six = numbersWithSixLines.filter(signal => !one.split('').every(char => signal.includes(char)))[0]
  // 3 only five liner with both elements in 1
  const three = numbersWithFiveLines.filter(signal => one.split('').every(char => signal.includes(char)))[0]
  // 9 only six liner with all elements in 4
  const nine = numbersWithSixLines.filter(signal => four.split('').every(char => signal.includes(char)))[0]
  // 0 remaining six liner
  const zero = numbersWithSixLines.filter(signal => signal !== six && signal !== nine)[0];
  
  // Two and Five are 5 liners which aren't three and contain 2 and 3 lines from four respectively
  let two = ''
  let five = ''
  for (let i = 0; i < numbersWithFiveLines.length; i++) {
    let fiveLiner = numbersWithFiveLines[i];
    if (fiveLiner === three) continue;

    const countOfSharedCharacters = four.split('').filter((charInFour) => fiveLiner.includes(charInFour)).length;
    if (countOfSharedCharacters === 2) {
      two = fiveLiner
    } else if (countOfSharedCharacters === 3) {
      five = fiveLiner
    }
  }

  return [zero, one, two, three, four, five, six, seven, eight, nine]
}