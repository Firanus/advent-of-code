import path from "path";
import fs from "fs";

type OperationType = "add" | "multiply" | "square";
interface Monkey {
  itemWorryLevels: number[];
  operationType: "add" | "multiply" | "square";
  operationValue?: number;
  divisibleByNumber: number;
  successMonkey: number;
  failureMonkey: number;
  inspectionCount: number;
}

const getOperationType = (
  operationStr: string,
  operationValueStr: string
): { operationType: OperationType; operationValue?: number } => {
  if (operationStr === "*" && operationValueStr === "old") {
    return { operationType: "square" };
  }

  if (operationStr === "*") {
    return {
      operationType: "multiply",
      operationValue: parseInt(operationValueStr, 10),
    };
  }

  return {
    operationType: "add",
    operationValue: parseInt(operationValueStr, 10),
  };
};

const getNewWorryLevel = (
  initialWorryLevel: number,
  monkey: Monkey
): number => {
  let newWorryLevel = -1;
  switch (monkey.operationType) {
    case "add":
      newWorryLevel = initialWorryLevel + (monkey.operationValue ?? 0);
      break;
    case "multiply":
      newWorryLevel = initialWorryLevel * (monkey.operationValue ?? 0);
      break;
    case "square":
      newWorryLevel = initialWorryLevel * initialWorryLevel;
      break;
  }

  return Math.floor(newWorryLevel / 3);
};

const passesTest = (worryLevel: number, monkey: Monkey): boolean =>
  worryLevel % monkey.divisibleByNumber === 0;

fs.readFile(
  path.resolve(__dirname, "../input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const monkeys: Monkey[] = data.split("\n\n").map((rawMonkey) => {
      const worryLevelsRegex = /(?<=Starting items: ).*?(?=\n)/;
      const operationsRegex = /(?<=Operation: new = old ).*?(?=\n)/;
      const divisibleRegex = /(?<=Test: divisible by ).*?(?=\n)/;
      const successRegex = /(?<=If true: throw to monkey ).*?(?=\n)/;
      const failureRegex = /(?<=If false: throw to monkey ).*?$/;

      const startingWorryLevels =
        rawMonkey
          .match(worryLevelsRegex)?.[0]
          ?.split(", ")
          .map((x) => parseInt(x, 10)) ?? [];

      const [operationTypeString, operationValueString] =
        rawMonkey.match(operationsRegex)?.[0].split(" ") ?? "";
      const { operationType, operationValue } = getOperationType(
        operationTypeString,
        operationValueString
      );

      const divisibleByNumber = parseInt(
        rawMonkey.match(divisibleRegex)?.[0] ?? "",
        10
      );
      const successMonkey = parseInt(
        rawMonkey.match(successRegex)?.[0] ?? "",
        10
      );
      const failureMonkey = parseInt(
        rawMonkey.match(failureRegex)?.[0] ?? "",
        10
      );

      return {
        itemWorryLevels: startingWorryLevels,
        operationType,
        operationValue,
        divisibleByNumber,
        successMonkey,
        failureMonkey,
        inspectionCount: 0,
      };
    });

    const ROUNT_COUNT = 20;
    for (let round = 0; round < ROUNT_COUNT; round++) {
      for (let i = 0; i < monkeys.length; i++) {
        const monkey = monkeys[i];
        const numberOfItems = monkey.itemWorryLevels.length;

        for (let j = 0; j < numberOfItems; j++) {
          const inspectedItem = monkey.itemWorryLevels.shift() ?? NaN;
          const newWorryLevel = getNewWorryLevel(inspectedItem, monkey);
          const nextMonkey = passesTest(newWorryLevel, monkey)
            ? monkey.successMonkey
            : monkey.failureMonkey;

          monkeys[nextMonkey].itemWorryLevels.push(newWorryLevel);
          monkey.inspectionCount++;
        }
      }
    }

    const monkeysByActivity = monkeys.sort(
      (a, b) => b.inspectionCount - a.inspectionCount
    );
    const monkeyBusiness = monkeysByActivity
      .slice(0, 2)
      .reduce((acc, curr) => acc * curr.inspectionCount, 1);
    console.log("Part 1 Solution: ", monkeyBusiness);
  }
);
