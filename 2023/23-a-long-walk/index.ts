import path from "path";
import fs from "fs";

interface Path {
  startingNode: Node;
  endingNode: Node;
  pathLength: number;
}

interface Node {
  x: number;
  y: number;
  paths: Path[];
}

interface InitialGridWalkJourneyPoint {
  x: number;
  y: number;
  currentStartingNode: Node;
  currentPathLength: number;
}

interface NodeWalkJourneyPoint {
  currentNode: Node;
  visitedNodes: string[];
  currentPathLength: number;
}

const msToTime = (duration: number) => {
  const seconds = Math.floor(duration / 1000) % 60;
  const minutes = Math.floor(duration / 60 / 1000) % 60;
  const hours = Math.floor(duration / 60 / 60 / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${(
    duration % 1000
  )
    .toString()
    .padStart(3, "0")}`;
};

const makeGraphFileForVisualisation = (
  nodes: { [key: string]: Node },
  fileName: string
) => {
  const processedElements = Object.keys(nodes).flatMap((key) => {
    return nodes[key].paths.map(
      (path) =>
        `"${key}" -> "${getNodeKey(path.endingNode)}" [ label = "${
          path.pathLength
        }"]`
    );
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

function isNonNullable<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

const getNodeKey = (node: { x: number; y: number }): string =>
  `node-${node.x},${node.y}`;

const getGridPointKey = (point: { x: number; y: number }): string =>
  `${point.x},${point.y}`;

const getSeenPointsKey = (point: InitialGridWalkJourneyPoint): string => {
  return `${getGridPointKey(point)}-${getNodeKey(point.currentStartingNode)}`;
};

const isPointAboveVisitable = (
  grid: string[][],
  point: { x: number; y: number },
  areSlopesClimbable: boolean
): Boolean => {
  if (point.y === 0 || grid[point.y - 1][point.x] === "#") {
    return false;
  }

  const val = grid[point.y][point.x];
  return val === "." || val === "^" || areSlopesClimbable;
};

const isPointBelowVisitable = (
  grid: string[][],
  point: { x: number; y: number },
  areSlopesClimbable: boolean
): Boolean => {
  if (point.y === grid.length - 1 || grid[point.y + 1][point.x] === "#") {
    return false;
  }

  const val = grid[point.y][point.x];
  return val === "." || val === "v" || areSlopesClimbable;
};

const isPointLeftVisitable = (
  grid: string[][],
  point: { x: number; y: number },
  areSlopesClimbable: boolean
): Boolean => {
  if (point.x === 0 || grid[point.y][point.x - 1] === "#") {
    return false;
  }

  const val = grid[point.y][point.x];
  return val === "." || val === "<" || areSlopesClimbable;
};

const isPointRightVisitable = (
  grid: string[][],
  point: { x: number; y: number },
  areSlopesClimbable: boolean
): Boolean => {
  if (point.x === grid[0].length - 1 || grid[point.y][point.x + 1] === "#") {
    return false;
  }

  const val = grid[point.y][point.x];
  return val === "." || val === ">" || areSlopesClimbable;
};

const makeGraph = (
  grid: string[][],
  areSlopesClimbable: boolean
): { [key: string]: Node } => {
  const startingNode: Node = { x: 1, y: 0, paths: [] };
  const endingNode: Node = {
    x: grid[0].length - 2,
    y: grid.length - 1,
    paths: [],
  };

  let seenPoints: { [key: string]: boolean } = {};
  let pointsToVisit: InitialGridWalkJourneyPoint[] = [
    {
      x: 1,
      y: 0,
      currentPathLength: 0,
      currentStartingNode: startingNode,
    },
  ];

  const nodes: { [key: string]: Node } = {
    [getNodeKey(startingNode)]: startingNode,
    [getNodeKey(endingNode)]: endingNode,
  };

  while (pointsToVisit.length) {
    const currentPoint = pointsToVisit.shift() as InitialGridWalkJourneyPoint;
    const { x, y, currentPathLength, currentStartingNode } = currentPoint;

    if (x === grid[0].length || y === grid.length || x === -1 || y === -1) {
      continue;
    }

    if (grid[y][x] === "#") {
      continue;
    }

    if (
      getNodeKey(currentPoint) === getNodeKey(currentStartingNode) &&
      currentPathLength > 0
    ) {
      continue;
    }

    const canGoUp = isPointAboveVisitable(
      grid,
      currentPoint,
      areSlopesClimbable
    );
    const canGoDown = isPointBelowVisitable(
      grid,
      currentPoint,
      areSlopesClimbable
    );
    const canGoLeft = isPointLeftVisitable(
      grid,
      currentPoint,
      areSlopesClimbable
    );
    const canGoRight = isPointRightVisitable(
      grid,
      currentPoint,
      areSlopesClimbable
    );
    const totalVisitable = [canGoUp, canGoDown, canGoLeft, canGoRight].filter(
      Boolean
    ).length;

    let newStartingNode = currentStartingNode;
    // We have found a node.
    if (totalVisitable > 2) {
      const existingNode = nodes[getNodeKey(currentPoint)];
      if (existingNode) {
        currentStartingNode.paths.push({
          startingNode: currentStartingNode,
          endingNode: existingNode,
          pathLength: currentPathLength,
        });
        newStartingNode = existingNode;
      } else {
        const newNode: Node = {
          x,
          y,
          paths: [],
        };
        currentStartingNode.paths.push({
          startingNode: currentStartingNode,
          endingNode: newNode,
          pathLength: currentPathLength,
        });
        nodes[getNodeKey(newNode)] = newNode;
        newStartingNode = newNode;
      }
    }

    if (seenPoints[getSeenPointsKey(currentPoint)]) {
      continue;
    }
    seenPoints[getSeenPointsKey(currentPoint)] = true;

    if (x === endingNode.x && y === endingNode.y) {
      const endNode = nodes[getNodeKey(currentPoint)];
      currentStartingNode.paths.push({
        startingNode: currentStartingNode,
        endingNode: endNode,
        pathLength: currentPathLength,
      });
      continue;
    }

    const foundNewNode =
      getNodeKey(newStartingNode) !== getNodeKey(currentStartingNode);
    pointsToVisit.push(
      ...[
        canGoRight
          ? {
              x: x + 1,
              y,
              currentPathLength: foundNewNode ? 1 : currentPathLength + 1,
              currentStartingNode: newStartingNode,
            }
          : undefined,
        canGoLeft
          ? {
              x: x - 1,
              y,
              currentPathLength: foundNewNode ? 1 : currentPathLength + 1,
              currentStartingNode: newStartingNode,
            }
          : undefined,
        canGoUp
          ? {
              x,
              y: y - 1,
              currentPathLength: foundNewNode ? 1 : currentPathLength + 1,
              currentStartingNode: newStartingNode,
            }
          : undefined,
        canGoDown
          ? {
              x,
              y: y + 1,
              currentPathLength: foundNewNode ? 1 : currentPathLength + 1,
              currentStartingNode: newStartingNode,
            }
          : undefined,
      ].filter(isNonNullable)
    );

    pointsToVisit.sort((a, b) => b.currentPathLength - a.currentPathLength);
  }

  return nodes;
};

const traverseGraphForLongestPath = (
  nodes: { [key: string]: Node },
  startKey: string,
  endKey: string
) => {
  const startTime = new Date();
  const startingNode = nodes[startKey];
  const endingNode = nodes[endKey];

  let completedJourneys: NodeWalkJourneyPoint[] = [];

  let nodesToWalk: NodeWalkJourneyPoint[] = [
    {
      currentNode: startingNode,
      visitedNodes: [],
      currentPathLength: 0,
    },
  ];

  let pointsVisited = 0;
  while (nodesToWalk.length) {
    pointsVisited += 1;
    const currentNode = nodesToWalk.pop() as NodeWalkJourneyPoint;
    const { currentNode: node, visitedNodes, currentPathLength } = currentNode;

    if (node === endingNode) {
      completedJourneys.push(currentNode);
      continue;
    }

    for (let i = 0; i < node.paths.length; i++) {
      const path = node.paths[i];
      if (visitedNodes.includes(getNodeKey(path.endingNode))) {
        continue;
      }
      nodesToWalk.push({
        currentNode: path.endingNode,
        visitedNodes: [...visitedNodes, getNodeKey(node)],
        currentPathLength: currentPathLength + path.pathLength,
      });
    }

    if (pointsVisited % 1000000 === 0) {
      console.log(
        pointsVisited,
        currentPathLength,
        nodesToWalk.length,
        currentNode.visitedNodes.length,
        completedJourneys.reduce(
          (acc, curr) => Math.max(acc, curr.currentPathLength),
          0
        ),
        "Time taken",
        `${msToTime(new Date().getTime() - startTime.getTime())}`
      );
    }
  }

  return completedJourneys.reduce(
    (acc, curr) => Math.max(acc, curr.currentPathLength),
    0
  );
};

// The trick with this problem is going to be that the paths are actually pretty
// compressible. You can see it in how the graph is structured. So the goal is to produce
// A smaller graph, and then traverse that.
fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const grid = data.split("\n").map((row) => row.split(""));

    const partOneNodes = makeGraph(grid, false);
    const partTwoNodes = makeGraph(grid, true);

    const s = getNodeKey({ x: 1, y: 0 });
    const e = getNodeKey({ x: grid[0].length - 2, y: grid.length - 1 });

    const part1Result = traverseGraphForLongestPath(partOneNodes, s, e);
    const part2Result = traverseGraphForLongestPath(partTwoNodes, s, e);

    console.log("Part 1 Solution -", part1Result);
    console.log("Part 2 Solution -", part2Result);
  }
);
