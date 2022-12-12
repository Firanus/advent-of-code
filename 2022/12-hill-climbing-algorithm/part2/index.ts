import path from "path";
import fs from "fs";

interface Node {
  x: number;
  y: number;
  height: number;
  isStarting: boolean;
  isFinishing: boolean;
  visited: boolean;
  tentativeDistance: number;
}

const getHeightForCharacter = (character: string): number => {
  if (character === "S") {
    return 0;
  }
  if (character === "E") {
    return 25;
  }
  const characterCode = character.charCodeAt(0);
  const asciiOffset = 97;
  return characterCode - asciiOffset;
};

const calculateHeuristic = (node: Node): number => {
  return node.tentativeDistance + (25 - node.height);
};

fs.readFile(
  path.resolve(__dirname, "../input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    let nodesToTraverse: Node[] = [];
    const nodes: Node[][] = data.split("\n").map((row, y) =>
      row.split("").map((char, x) => {
        const node = {
          x,
          y,
          height: getHeightForCharacter(char),
          isStarting: char === "S" || char === "a",
          isFinishing: char === "E",
          visited: false,
          tentativeDistance:
            char === "S" || char === "a" ? 0 : Number.MAX_SAFE_INTEGER,
        };
        if (char === "S" || char === "a") {
          nodesToTraverse.push(node);
        }
        return node;
      })
    );

    let hasVisitedFinishingNode = false;
    let minDistance = -1;
    while (nodesToTraverse.length > 0 && !hasVisitedFinishingNode) {
      const visitingNode = nodesToTraverse.shift()!;
      const { x, y, height, isFinishing, tentativeDistance } = visitingNode;

      const nodesToCheck: Node[] = [];
      if (x > 0) nodesToCheck.push(nodes[y][x - 1]);
      if (y > 0) nodesToCheck.push(nodes[y - 1][x]);
      if (x < nodes[0].length - 1) nodesToCheck.push(nodes[y][x + 1]);
      if (y < nodes.length - 1) nodesToCheck.push(nodes[y + 1][x]);

      for (let i = 0; i < nodesToCheck.length; i++) {
        const neightbouringNode = nodesToCheck[i];
        if (
          neightbouringNode.height - 1 <= height &&
          neightbouringNode.visited === false
        ) {
          neightbouringNode.tentativeDistance = Math.min(
            tentativeDistance + 1,
            neightbouringNode.tentativeDistance
          );
          nodesToTraverse.push(neightbouringNode);
        }
      }

      visitingNode.visited = true;
      if (isFinishing) {
        minDistance = visitingNode.tentativeDistance;
        hasVisitedFinishingNode = true;
      }

      // In a perfect world, we'd use a minHeap. Fof the purposes here, a regular
      // array with a simple nlgn sort will be fine;
      nodesToTraverse = nodesToTraverse
        .filter((x) => !x.visited)
        .sort((a, b) => calculateHeuristic(a) - calculateHeuristic(b));
    }
    console.log("Part 2 Solution:", minDistance);
  }
);
