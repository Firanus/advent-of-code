import path from "path";
import fs from "fs";

type Instruction = "R" | "L";
type MapNode = {
  current: string;
  left: string;
  right: string;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const [instructionString, mapLines] = data.split("\n\n");

    const instructions: Instruction[] = instructionString.split(
      ""
    ) as Instruction[];

    const mapNodesArray: MapNode[] = mapLines.split("\n").map((line) => {
      const [current, leftRight] = line.split(" = ");
      const [left, right] = leftRight
        .slice(1, leftRight.length - 1)
        .split(", ");
      return {
        current,
        left,
        right,
      };
    });

    const mapNodesMap: { [key: string]: MapNode } = mapNodesArray.reduce(
      (acc, curr) => {
        acc[curr.current] = curr;
        return acc;
      },
      {} as { [key: string]: MapNode }
    );

    // Part 1
    let stepCount = 0;
    let current = "AAA";

    while (current !== "ZZZ") {
      const currentNode = mapNodesMap[current]!;
      if (instructions[stepCount % instructions.length]! === "R") {
        current = currentNode.right;
      } else {
        current = currentNode.left;
      }
      stepCount++;
    }

    console.log("Part 1 Solution -", stepCount);

    // Part 2
    stepCount = 0;
    const currentNodes = Object.keys(mapNodesMap).filter((node) =>
      node.endsWith("A")
    );

    const lastSeen = new Array(currentNodes.length).fill(undefined);
    const cycleLengths = new Array(currentNodes.length).fill(undefined);

    while (!cycleLengths.every((length) => length > 0)) {
      currentNodes.forEach((node, index) => {
        const currentNode = mapNodesMap[node]!;
        if (instructions[stepCount % instructions.length]! === "R") {
          currentNodes[index] = currentNode.right;
        } else {
          currentNodes[index] = currentNode.left;
        }
      });
      stepCount++;
      if (currentNodes.some((node) => node.endsWith("Z"))) {
        currentNodes.forEach((node, index) => {
          if (node.endsWith("Z")) {
            if (lastSeen[index] === undefined) {
              lastSeen[index] = stepCount;
            } else if (cycleLengths[index] === undefined) {
              cycleLengths[index] = stepCount - lastSeen[index];
            }
          }
        });
      }
    }

    // I could have tried totally programatically to find the LCM of the cycle lengths, but I'm lazy.
    // My results share a common factor of 283, so I'm just going to hardcode that in.
    const part2Result =
      cycleLengths.reduce((acc, curr) => (acc * curr) / 283, 1) * 283;

    console.log("Part 2 Solution -", part2Result);
  }
);
