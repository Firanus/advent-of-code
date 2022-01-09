const path = require("path");
const fs = require("fs");

const comparisonPasses = (regValue, command, comparisonValue) => {
  switch (command) {
    case "<":
      return regValue < comparisonValue;
    case ">":
      return regValue > comparisonValue;
    case "<=":
      return regValue <= comparisonValue;
    case ">=":
      return regValue >= comparisonValue;
    case "==":
      return regValue === comparisonValue;
    case "!=":
      return regValue !== comparisonValue;
    default:
      return false;
  }
};

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const instructions = data.split("\n");

  const registers = {};
  let greatestValueEver = 0;
  instructions.forEach((ins) => {
    const [
      reg,
      command,
      quantString,
      _ifString,
      comparisonReg,
      commandType,
      comparisonValue,
    ] = ins.split(" ");

    const regValue = registers[reg] ?? 0;
    const comparisonRegValue = registers[comparisonReg] ?? 0;

    if (
      comparisonPasses(
        comparisonRegValue,
        commandType,
        parseInt(comparisonValue)
      )
    ) {
      let newValue = regValue;
      if (command === "inc") {
        newValue = regValue + parseInt(quantString);
      } else {
        newValue = regValue - parseInt(quantString);
      }

      if (newValue > greatestValueEver) {
        greatestValueEver = newValue;
      }
      registers[reg] = newValue;
    }
  });

  const greatestValueAtEnd = Object.keys(registers).reduce(
    (acc, curr) => Math.max(acc, registers[curr]),
    0
  );

  console.log("Part 1 answer:", greatestValueAtEnd);
  console.log("Part 2 answer:", greatestValueEver);
});
