import path from "path";
import fs from "fs";

interface LinkedListNode {
  value: number;
  originalPosition: number;
  nextNode: LinkedListNode;
  previousNode: LinkedListNode;
}

const getNextNode = (n: LinkedListNode, positions: number): LinkedListNode => {
  if (positions === 0) return n;
  return getNextNode(n.nextNode, positions - 1);
};

const getPrevNode = (n: LinkedListNode, positions: number): LinkedListNode => {
  if (positions === 0) return n;
  return getPrevNode(n.previousNode, positions - 1);
};

const visualiseList = (startingNode: LinkedListNode, positions: number) => {
  if (positions === 0) {
    console.log("----");
    return;
  }
  console.log(startingNode.value);
  visualiseList(startingNode.nextNode, positions - 1);
};

const moveForward = (node: LinkedListNode, positions: number) => {
  if (positions === 0) return;
  const originalPrevious = node.previousNode;
  const originalForward = node.nextNode;

  originalPrevious.nextNode = originalForward;
  originalForward.previousNode = originalPrevious;

  const newPreviousNode = getNextNode(node, positions);
  const newNextNode = getNextNode(node, positions + 1);

  newPreviousNode.nextNode = node;
  node.previousNode = newPreviousNode;
  newNextNode.previousNode = node;
  node.nextNode = newNextNode;
};

const moveBackwards = (node: LinkedListNode, positions: number) => {
  if (positions === 0) return;
  const originalPrevious = node.previousNode;
  const originalForward = node.nextNode;

  originalPrevious.nextNode = originalForward;
  originalForward.previousNode = originalPrevious;

  const newNextNode = getPrevNode(node, positions);
  const newPreviousNode = getPrevNode(node, positions + 1);

  newPreviousNode.nextNode = node;
  node.previousNode = newPreviousNode;
  newNextNode.previousNode = node;
  node.nextNode = newNextNode;
};

// 2785 is too low
fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const generateInput = (multiplicativeFactor: number): LinkedListNode[] => {
      const linkedListNodes: LinkedListNode[] = data.split("\n").map(
        (numStr, index) =>
          ({
            value: parseInt(numStr) * multiplicativeFactor,
            originalPosition: index,
          } as LinkedListNode)
      );
      linkedListNodes.forEach((unlinked, index) => {
        unlinked.nextNode =
          index === linkedListNodes.length - 1
            ? linkedListNodes[0]
            : linkedListNodes[index + 1];
        unlinked.previousNode =
          index === 0
            ? linkedListNodes[linkedListNodes.length - 1]
            : linkedListNodes[index - 1];
      });
      return linkedListNodes;
    };

    // visualiseList(linkedListNodes[0], 7);
    const mix = (linkedListNodes: LinkedListNode[]) => {
      for (let i = 0; i < linkedListNodes.length; i++) {
        const currentNode = linkedListNodes[i];
        const normalisedValue =
          currentNode.value % (linkedListNodes.length - 1);
        // minimise operations
        const positionsToMove =
          normalisedValue > linkedListNodes.length / 2
            ? normalisedValue - (linkedListNodes.length - 1)
            : normalisedValue < -linkedListNodes.length / 2
            ? normalisedValue + (linkedListNodes.length - 1)
            : normalisedValue;

        positionsToMove > 0
          ? moveForward(currentNode, positionsToMove)
          : moveBackwards(currentNode, -positionsToMove);
      }
    };

    const calcuateSolutionForNodes = (
      linkedListNodes: LinkedListNode[]
    ): number => {
      const zeroNode = linkedListNodes.find((n) => n.value === 0)!;

      const solution = [1000, 2000, 3000]
        .map((x) => x % linkedListNodes.length)
        .map((i) => getNextNode(zeroNode, i))
        .map((n) => n.value)
        .reduce((acc, curr) => acc + curr, 0);

      return solution;
    };

    // Part 1
    const part1ListNodes = generateInput(1);
    mix(part1ListNodes);
    console.log("Part 1 Solution:", calcuateSolutionForNodes(part1ListNodes));

    // Part 2
    const DESCRIPTION_KEY = 811589153;
    const part2ListNodes = generateInput(DESCRIPTION_KEY);
    for (let i = 0; i < 10; i++) mix(part2ListNodes);
    console.log("Part 2 Solution:", calcuateSolutionForNodes(part2ListNodes));
  }
);
