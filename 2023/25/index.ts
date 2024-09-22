import path from "path";
import fs from "fs";

const makeGraphFileForVisualisation = (
  nodes: { [key: string]: string[] },
  fileName: string
) => {
  const processedElements = Object.keys(nodes).flatMap((key) => {
    return nodes[key].map((value) => `"${key}" -> "${value}"`);
  });

  const stream = fs.createWriteStream(
    path.resolve(__dirname, `./graphs/${fileName}.dot`)
  );
  stream.once("open", function (fd) {
    stream.write("digraph input {\n");
    processedElements.forEach((x) => stream.write(`  ${x}\n`));
    stream.write("}\n");
    stream.end();
  });
};

const getNodePairKey = (node1: string, node2: string): string =>
  [node1, node2].sort().join(",");

interface JourneyPoint {
  node: string;
  travelledNodes: string[];
}

const countNodesLinkedToNode = (
  node: string,
  nodeGraph: { [key: string]: string[] }
) => {
  const nodesToTravel: JourneyPoint[] = [{ node, travelledNodes: [] }];
  const visitedNodes: string[] = [];

  while (nodesToTravel.length) {
    const { node, travelledNodes } = nodesToTravel.shift() as JourneyPoint;

    if (visitedNodes.includes(node)) {
      continue;
    }

    visitedNodes.push(node);

    const nextNodes = nodeGraph[node].map((nextNode) => ({
      node: nextNode,
      travelledNodes: [...travelledNodes, node],
    }));

    nodesToTravel.push(...nextNodes);
  }

  return Object.keys(visitedNodes).length;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const nodeGraph: { [key: string]: string[] } = {};

    data.split("\n").map((row) => {
      const [key, valuesString] = row.split(": ");
      const values = valuesString.split(" ");

      if (nodeGraph[key]) {
        nodeGraph[key] = [...nodeGraph[key], ...values];
      } else {
        nodeGraph[key] = values;
      }

      values.forEach((value) => {
        if (nodeGraph[value]) {
          nodeGraph[value] = [...nodeGraph[value], key];
        } else {
          nodeGraph[value] = [key];
        }
      });
    });

    // I know from inspection that qnd and ddq are in separate graphs in the input
    // bvb and cng in test

    // Try something called Menger's theorem
    // https://en.wikipedia.org/wiki/Menger%27s_theorem
    // Find 3 distinct ways form A to B

    // const startNode = "bvb";
    // const endNode = "cmg";
    // const startNode = "hjp";
    // const endNode = "hgt";
    const startNode = "qnd";
    const endNode = "mbk";

    // Remove first connection
    nodeGraph["qnd"] = nodeGraph["qnd"].filter((x) => x !== "mbk");
    nodeGraph["mbk"] = nodeGraph["mbk"].filter((x) => x !== "qnd");
    nodeGraph["lcm"] = nodeGraph["lcm"].filter((x) => x !== "ddl");
    nodeGraph["ddl"] = nodeGraph["ddl"].filter((x) => x !== "lcm");
    nodeGraph["pcs"] = nodeGraph["pcs"].filter((x) => x !== "rrl");
    nodeGraph["rrl"] = nodeGraph["rrl"].filter((x) => x !== "pcs");
    makeGraphFileForVisualisation(nodeGraph, "input-removedConnection");

    const leftSide = countNodesLinkedToNode(startNode, nodeGraph);
    const rightSide = countNodesLinkedToNode(endNode, nodeGraph);
    console.log(leftSide * rightSide);
    // console.log(leftSide, rightSide, Object.keys(nodeGraph).length);

    // const nodesToTravel: JourneyPoint[] = [
    //   { node: startNode, travelledNodes: [] },
    // ];
    // const visitedNodes: string[] = [];
    // const completedJourneys: JourneyPoint[] = [];

    // while (nodesToTravel.length) {
    //   // console.log(nodesToTravel);
    //   const { node, travelledNodes } = nodesToTravel.shift() as JourneyPoint;

    //   if (visitedNodes.includes(node)) {
    //     continue;
    //   }

    //   if (node === endNode) {
    //     // console.log("Proposal", { node, visitedNodes }, completedJourneys);
    //     if (
    //       completedJourneys
    //         .map(
    //           (x) =>
    //             x.travelledNodes.filter((y) => travelledNodes.includes(y))
    //               .length
    //         )
    //         .reduce((acc, curr) => Math.max(acc, curr), 0) < 2
    //     ) {
    //       completedJourneys.push({ node, travelledNodes });
    //     }
    //     continue;
    //   }

    //   visitedNodes.push(node);

    //   const nextNodes = nodeGraph[node].map((nextNode) => ({
    //     node: nextNode,
    //     travelledNodes: [...travelledNodes, node],
    //   }));

    //   nodesToTravel.push(...nextNodes);
    // }

    // console.log(completedJourneys);
    // makeGraphFileForVisualisation(similarNodeGraph, "testInput-similarNodes");

    // const part1Result = winCounts.reduce((acc, curr) => acc * curr, 1);

    // console.log("Part 1 Solution -", part1Result);
  }
);

// const nodesSimilarities: [string, string[]][] = [];

// for (let i = 0; i < nodeKeys.length; i++) {
//   for (let j = i + 1; j < nodeKeys.length; j++) {
//     const node1 = nodeKeys[i];
//     const node2 = nodeKeys[j];
//     const nodePairKey = getNodePairKey(node1, node2);
//     const node1Values = nodeGraph[node1];
//     const node2Values = nodeGraph[node2];
//     const similarity = node1Values.filter((x) => node2Values.includes(x));
//     nodesSimilarities.push([nodePairKey, similarity]);
//   }
// }

// const similaritiesGreaterThanTwo = nodesSimilarities.filter(
//   (x) => x[1].length >= 2
// );
// console.log(nodesSimilarities, similaritiesGreaterThanTwo);

// // Assume anything with a similarity greater than 2 is part of the same graph.
// const similarPairs = nodesSimilarities.filter((x) => x[1].length >= 2);

// const similarNodeGraph = similarPairs.reduce((acc, curr) => {
//   const [node1, node2] = curr[0].split(",");
//   if (acc[node1]) {
//     acc[node1].push(...curr[1], node2);
//   } else {
//     acc[node1] = [...curr[1], node2];
//   }
//   if (acc[node2]) {
//     acc[node2].push(...curr[1], node1);
//   } else {
//     acc[node2] = [...curr[1], node1];
//   }
//   return acc;
// }, {} as { [key: string]: string[] });

// console.log(similarPairs);
// console.log(similarNodeGraph);
