import path from "path";
import fs from "fs";

interface TreeNode {
  name: string;
  personalWeight?: number;
  weight?: number;
  parent?: TreeNode;
  children?: TreeNode[];
}

type HashMapOfTreeNodes = {
  [key: string]: TreeNode;
};

const hashMapOfTreeNodes: HashMapOfTreeNodes = {};

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const rawTreeElements = data.split("\n");

  const nodes = rawTreeElements.map((rawElement) => {
    const [parentInfo, childrenInfo] = rawElement.split(" -> ");
    const [name, weightString] = parentInfo.split(" ");
    let children: TreeNode[] | undefined;

    if (childrenInfo) {
      children = childrenInfo.split(", ").map(getNodeForName);
    }

    let parentNode = getNodeForName(name);
    parentNode.personalWeight = parseInt(
      weightString.slice(1, weightString.length - 1)
    );
    parentNode.name = name;

    children?.forEach((child) => {
      child.parent = parentNode;
    });
    parentNode.children = children;

    hashMapOfTreeNodes[name] = parentNode;
    children?.forEach((child) => {
      hashMapOfTreeNodes[child.name] = child;
    });

    return parentNode;
  });

  const rootNode = findRoot(nodes[0]);
  console.log("Part 1 Answer (name of root node):", rootNode.name);

  setWeightOfNodeAndChildren(rootNode);
  const unbalancedNode = findUnbalancedNode(rootNode);
  const part2Answer = findPart2Answer(unbalancedNode!);

  console.log("Part 2 Answer:", part2Answer);
});

const findRoot = (node: TreeNode): TreeNode => {
  if (node.parent) {
    return findRoot(node.parent);
  }

  return node;
};

const setWeightOfNodeAndChildren = (node: TreeNode) => {
  if (!node.children) {
    node.weight = node.personalWeight ?? 0;
    return;
  }

  node.children.forEach((child) => setWeightOfNodeAndChildren(child));
  const weightOfChildren = node.children.reduce(
    (acc, curr) => acc + (curr.weight ?? 0),
    0
  );

  node.weight = (node.personalWeight ?? 0) + weightOfChildren;
};

const findPart2Answer = (node: TreeNode): number => {
  if (!node.children) {
    return 0;
  }

  let standardWeight;
  let outsider;

  const nodesWithSameWeightAsFirst = node.children.filter(
    (child) => child.weight === (node.children?.[0]?.weight ?? 0)
  );
  const nodesWithWeightsDifferentToFirst = node.children.filter(
    (child) => child.weight !== (node.children?.[0]?.weight ?? 0)
  );

  if (nodesWithSameWeightAsFirst.length > 1) {
    standardWeight = nodesWithSameWeightAsFirst[0]!.weight;
    outsider = nodesWithWeightsDifferentToFirst[0]!;
  } else {
    outsider = nodesWithSameWeightAsFirst[0]!;
    standardWeight = nodesWithWeightsDifferentToFirst[0]!.weight;
  }

  return (
    (outsider.personalWeight ?? 0) -
    Math.abs((standardWeight ?? 0) - (outsider.weight ?? 0))
  );
};

const findUnbalancedNode = (node: TreeNode): TreeNode | undefined => {
  if (!node.children) {
    return;
  }

  let unbalancedNode: TreeNode | undefined;
  for (let i = 0; i < node.children.length; i++) {
    const foundNode = findUnbalancedNode(node.children[i]);
    if (foundNode) {
      unbalancedNode = foundNode;
      break;
    }
  }

  if (unbalancedNode) {
    return unbalancedNode;
  }

  if (isNodeUnbalanced(node)) {
    return node;
  }

  return undefined;
};

const isNodeUnbalanced = (node: TreeNode): boolean => {
  if (!node.children) {
    return false;
  }

  const allWeightsEqual = node.children.reduce(
    (acc, curr) => acc && curr.weight === (node.children?.[0]?.weight ?? 0),
    true
  );
  return !allWeightsEqual;
};

const getNodeForName = (name: string): TreeNode => {
  const existingNode = hashMapOfTreeNodes[name];
  if (existingNode) {
    return existingNode;
  }

  const newNode: TreeNode = {
    name,
  };
  return newNode;
};
