const path = require("path");
const fs = require("fs").promises;

// The form of inputs will vary, but broadly speaking, each `inp` instruction will pull an item off the array
const alu = (inputInstructions, inputs) => {
  const registers = {
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  };

  const processSecondInput = (inputCharacter) => {
    if (
      inputCharacter === "w" ||
      inputCharacter === "x" ||
      inputCharacter === "y" ||
      inputCharacter === "z"
    ) {
      return registers[inputCharacter];
    }

    return parseInt(inputCharacter);
  };

  for (let i = 0; i < inputInstructions.length; i++) {
    let instruction = inputInstructions[i];
    const [instructionType, register, rawSecondInput] = instruction.split(" ");

    switch (instructionType) {
      case "inp":
        registers[register] = inputs.shift();
        break;
      case "add":
        registers[register] += processSecondInput(rawSecondInput);
        break;
      case "mul":
        registers[register] =
          registers[register] * processSecondInput(rawSecondInput);
        break;
      case "div":
        registers[register] = Math.floor(
          registers[register] / processSecondInput(rawSecondInput)
        );
        break;
      case "mod":
        registers[register] =
          registers[register] % processSecondInput(rawSecondInput);
        break;
      case "eql":
        registers[register] =
          registers[register] === processSecondInput(rawSecondInput) ? 1 : 0;
        break;
    }

    console.log(
      `Line ${`${i}`.padStart(3, "0")}: ${instruction.padEnd(8)}`,
      registers
    );
  }
  return registers;
};

let negativeNumberInstructions;
let checkTripleInstructions;
let storeFirstFourBinaryDigits;
let MONADInstructions;

const getInputFiles = async () => {
  [
    negativeNumbersData,
    checkTripleData,
    storeFirstFourBinaryDigitsData,
    monadData,
  ] = await Promise.all([
    fs.readFile(path.resolve(__dirname, "./negateNumberInput.txt"), "utf8"),
    fs.readFile(path.resolve(__dirname, "./checkTripleInput.txt"), "utf8"),
    fs.readFile(
      path.resolve(__dirname, "./storeFirstFourBinaryDigits.txt"),
      "utf8"
    ),
    fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8"),
  ]);
  negativeNumberInstructions = negativeNumbersData.split("\n");
  checkTripleInstructions = checkTripleData.split("\n");
  storeFirstFourBinaryDigits = storeFirstFourBinaryDigitsData.split("\n");
  MONADInstructions = monadData.split("\n");
};

(async () => {
  await getInputFiles();

  // console.log("-----");
  // console.log("Negative Numbers Input");
  // console.log("-----");
  // alu(negativeNumberInstructions, [2]);

  // console.log("-----");
  // console.log("Check Triple Inputs");
  // console.log("-----");
  // alu(checkTripleInstructions, [1, 3]);
  // console.log("-----");
  // alu(checkTripleInstructions, [3, 3]);

  // console.log("-----");
  // console.log("Store First Four Binary Digits Inputs");
  // console.log("-----");
  // alu(storeFirstFourBinaryDigits, [15]);

  // The key to this problem is figuring out Monad inputs are "valid", indicated
  // by a 0 in z at the end of the program run. The code here only helps by
  // visualising the output of z.

  // For completeness, my solution was (treating w_i as the input character at i):
  // w_0 = w_13 + 8
  // w_1 = w_12 - 8
  // w_2 =  w_3 + 7
  // w_4 =  w_5 - 1
  // w_6 = w_11 - 8
  // w_7 =  w_8 - 5
  // w_9 = w_10

  console.log("-----");
  console.log("Monad");
  console.log("-----");
  alu(
    MONADInstructions,
    "91811211611981".split("").map((x) => parseInt(x))
  );
})();
