import path from "path";
import fs from "fs";

interface MonkeyValueNode {
  type: "V";
  name: string;
  value: number;
}
interface MonkeyOperationNode {
  type: "O";
  name: string;
  operation: "+" | "*" | "/" | "-";
  otherMonkeys: [string, string];
}
type Operation = "+" | "*" | "/" | "-";
type MonkeyNode = MonkeyValueNode | MonkeyOperationNode;
type Monkeys = { [name: string]: MonkeyNode };

const isMonkeyValueNode = (monkey: MonkeyNode): monkey is MonkeyValueNode =>
  monkey.type === "V";

const getMonkeyValue = (monkeyName: string, monkeys: Monkeys): number => {
  const monkey = monkeys[monkeyName];
  if (isMonkeyValueNode(monkey)) return monkey.value;

  const [left, right] = monkey.otherMonkeys;
  switch (monkey.operation) {
    case "*":
      return getMonkeyValue(left, monkeys) * getMonkeyValue(right, monkeys);
    case "/":
      return getMonkeyValue(left, monkeys) / getMonkeyValue(right, monkeys);
    case "+":
      return getMonkeyValue(left, monkeys) + getMonkeyValue(right, monkeys);
    case "-":
      return getMonkeyValue(left, monkeys) - getMonkeyValue(right, monkeys);
  }
};

const branchContainsHuman = (monkeyName: string, monkeys: Monkeys): boolean => {
  if (monkeyName === "humn") return true;

  const monkey = monkeys[monkeyName];
  if (isMonkeyValueNode(monkey)) return false;

  const [left, right] = monkey.otherMonkeys;
  return (
    branchContainsHuman(left, monkeys) || branchContainsHuman(right, monkeys)
  );
};

const getHumanValue = (
  monkeyName: string,
  targetValue: number,
  monkeys: Monkeys
): number => {
  if (monkeyName === "humn") return targetValue;

  const monkey = monkeys[monkeyName];
  if (isMonkeyValueNode(monkey))
    throw new Error("getHumanValue should never reach a value node");

  const [left, right] = monkey.otherMonkeys;
  const branchWithHuman = branchContainsHuman(left, monkeys) ? left : right;
  const branchWithoutHuman = branchWithHuman === left ? right : left;
  const isBranchWithHumanLeft = branchWithHuman === left;

  const comparisonValue = getMonkeyValue(branchWithoutHuman, monkeys);

  switch (monkey.operation) {
    case "*":
      return getHumanValue(
        branchWithHuman,
        targetValue / comparisonValue,
        monkeys
      );
    case "/":
      return getHumanValue(
        branchWithHuman,
        isBranchWithHumanLeft
          ? targetValue * comparisonValue
          : comparisonValue / targetValue,
        monkeys
      );
    case "+":
      return getHumanValue(
        branchWithHuman,
        targetValue - comparisonValue,
        monkeys
      );
    case "-":
      return getHumanValue(
        branchWithHuman,
        isBranchWithHumanLeft
          ? targetValue + comparisonValue
          : comparisonValue - targetValue,
        monkeys
      );
  }
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const monkeys: Monkeys = data.split("\n").reduce<Monkeys>((acc, curr) => {
      const [name, valOrOp] = curr.split(": ");
      if (!isNaN(parseInt(valOrOp, 10))) {
        acc[name] = { name, type: "V", value: parseInt(valOrOp, 10) };
        return acc;
      }

      const [monkeyOne, operation, monkeyTwo] = valOrOp.split(" ");
      acc[name] = {
        name,
        type: "O",
        otherMonkeys: [monkeyOne, monkeyTwo],
        operation: operation as Operation,
      };
      return acc;
    }, {});

    const part1Solution = getMonkeyValue("root", monkeys);
    console.log("Part 1 Solution:", part1Solution);

    const rootMonkey = monkeys["root"];
    if (isMonkeyValueNode(rootMonkey)) {
      throw new Error("This puzzle is too easy");
    }

    const [left, right] = rootMonkey.otherMonkeys;
    const branchWithHuman = branchContainsHuman(left, monkeys) ? left : right;
    const branchWithoutHuman = branchWithHuman === left ? right : left;

    const finalValue = getMonkeyValue(branchWithoutHuman, monkeys);
    const humanValue = getHumanValue(branchWithHuman, finalValue, monkeys);
    console.log("Part 2 Solution:", humanValue);
  }
);
