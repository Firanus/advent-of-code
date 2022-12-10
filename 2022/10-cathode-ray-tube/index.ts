import path from "path";
import fs from "fs";
import { assert } from "console";

type NoopInstrction = { type: "noop" };
type AddxInstrction = { type: "addx"; value: number };
type Instruction = NoopInstrction | AddxInstrction;

const isNoopInstruction = (inst: Instruction): inst is NoopInstrction =>
  inst.type === "noop";
const isAddxInstruction = (inst: Instruction): inst is AddxInstrction =>
  inst.type === "addx";

const SCREEN_WIDTH = 40;
const isClockValueToWatchForSignal = (value: number) =>
  value === 20 || (value - 20) % 40 === 0;
const isClockValueToWatchForDrawing = (value: number) =>
  value % SCREEN_WIDTH === 0;

const doSpriteAndPositionOverlap = (
  clockValue: number,
  spritePosition: number
) => {
  const pixelDrawingPosition = (clockValue - 1) % 40;
  return (
    pixelDrawingPosition === spritePosition - 1 ||
    pixelDrawingPosition === spritePosition ||
    pixelDrawingPosition === spritePosition + 1
  );
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const instructions: Instruction[] = data
      .split("\n")
      .map((rawInstruction) => {
        const [type, value] = rawInstruction.split(" ");
        if (type === "noop") {
          return { type: "noop" };
        } else if (type === "addx") {
          return { type: "addx", value: parseInt(value, 10) };
        }
        throw new Error("Unknown instruction type");
      });

    const signalStrengths: number[] = [];
    let clockValue = 1;
    let xRegister = 1;

    let drawnImage: string[] = [];

    const handleClockCycle = (localClock: number) => {
      if (isClockValueToWatchForSignal(localClock)) {
        signalStrengths.push(xRegister * clockValue);
      }
      drawnImage.push(
        doSpriteAndPositionOverlap(localClock, xRegister) ? "#" : "."
      );
      if (isClockValueToWatchForDrawing(localClock)) {
        drawnImage.push("\n");
      }
    };

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];

      if (isNoopInstruction(instruction)) {
        handleClockCycle(clockValue);
        clockValue += 1;
      } else if (isAddxInstruction(instruction)) {
        handleClockCycle(clockValue);
        handleClockCycle(clockValue + 1);
        clockValue += 2;
        xRegister = xRegister + instruction.value;
      } else {
        throw new Error("Unknown instruction type");
      }
    }

    const part1Solution = signalStrengths.reduce((acc, curr) => acc + curr, 0);
    console.log("Part 1 Solution:", part1Solution);
    console.log("Part 2 Solution:");
    console.log(drawnImage.join(""));
  }
);
