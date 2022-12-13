import path from "path";
import fs from "fs";

type PacketData = number | PacketData[];
type Packet = PacketData[];
const isInteger = (x: number | PacketData[]): x is number =>
  typeof x === "number";

const arePairsInRightOrder = (
  left: Packet,
  right: Packet
): boolean | undefined => {
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    let leftValue = left[leftIndex];
    let rightValue = right[rightIndex];

    if (isInteger(leftValue) && isInteger(rightValue)) {
      if (leftValue < rightValue) return true;
      if (leftValue > rightValue) return false;
      else {
        leftIndex += 1;
        rightIndex += 1;
        continue;
      }
    }

    if (isInteger(leftValue) && !isInteger(rightValue)) {
      leftValue = [leftValue];
    } else if (!isInteger(leftValue) && isInteger(rightValue)) {
      rightValue = [rightValue];
    }

    const newLeftValue = leftValue as Packet;
    const newRightValue = rightValue as Packet;

    const arraysInRightOrder = arePairsInRightOrder(
      newLeftValue,
      newRightValue
    );

    if (arraysInRightOrder !== undefined) {
      return arraysInRightOrder;
    } else {
      leftIndex += 1;
      rightIndex += 1;
      continue;
    }
  }

  if (leftIndex === left.length && rightIndex < right.length) {
    return true;
  } else if (leftIndex < left.length && rightIndex === right.length) {
    return false;
  }

  return undefined;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const packetPairs: [Packet, Packet][] = data.split("\n\n").map((pair) => {
      return pair
        .split("\n")
        .map((packetString) => JSON.parse(packetString) as Packet) as [
        Packet,
        Packet
      ];
    });

    const pairsInRightOrder: number[] = [];
    for (let i = 0; i < packetPairs.length; i++) {
      const [left, right] = packetPairs[i];
      const inRightOrder = arePairsInRightOrder(left, right);

      if (inRightOrder) {
        pairsInRightOrder.push(i + 1);
      }
    }

    const sumOfIndices = pairsInRightOrder.reduce((acc, curr) => acc + curr, 0);
    console.log("Part 1 Solution:", sumOfIndices);

    const firstAddedPacket = [[2]];
    const secondAddedPacket = [[6]];
    packetPairs.push([firstAddedPacket, secondAddedPacket]);

    const allPackets = packetPairs.flat();
    allPackets.sort((a, b) => {
      const inRightOrder = arePairsInRightOrder(a, b);
      if (inRightOrder) return -1;
      if (inRightOrder === undefined) return 0;
      return 1;
    });

    const indexOfFirstAddedPacket = allPackets.indexOf(firstAddedPacket) + 1;
    const indexOfSecondAddedPacket = allPackets.indexOf(secondAddedPacket) + 1;

    console.log(
      "Part 2 Solution:",
      indexOfFirstAddedPacket * indexOfSecondAddedPacket
    );
  }
);
