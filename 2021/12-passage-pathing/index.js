const path = require("path");
const fs = require("fs");

const pathsToEnd = [];
fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Map structure: object of allowed paths out of each path. E.g.
  // {
  //   [start]: [A, b],
  //   [A]: [start, end, b],
  //   [b]: [start, end, A],
  //   [end]: [A, b]
  // }
  //
  // For grid:
  //   start
  //   /   \
  //  A-----b
  //   \   /
  //    end
  //

  const graph = {};
  const connections = data.split("\n");
  for (let i = 0; i < connections.length; i++) {
    const connection = connections[i];
    const [startPoint, endPoint] = connection.split("-");
    const existingStartConnections = graph[startPoint];
    const existingEndConnections = graph[endPoint];

    graph[startPoint] = existingStartConnections
      ? [...existingStartConnections, endPoint]
      : [endPoint];
    graph[endPoint] = existingEndConnections
      ? [...existingEndConnections, startPoint]
      : [startPoint];
  }

  navigateGraphToEnd(graph, "start", "");
  console.log(pathsToEnd.length);
});

const navigateGraphToEnd = (graph, currentPosition, currentPath) => {
  if (currentPosition === "end") {
    pathsToEnd.push(currentPath + ",end");
    return;
  }

  const pathTravelled =
    currentPath +
    (currentPath === "" ? currentPosition : `,${currentPosition}`);
  const cavesOut = graph[currentPosition];

  cavesOut.forEach((caveOut) => {
    // Condition for Part 1
    // if (isCaveSmall(caveOut) && pathHasVisitedCave(pathTravelled, caveOut)) {
    //   return;
    // }

    // Condition for Part 2
    if (
      caveOut === "start" ||
      (isCaveSmall(caveOut) &&
        pathHasVisitedAnySmallCaveTwice(pathTravelled) &&
        pathHasVisitedCave(pathTravelled, caveOut))
    ) {
      return;
    }

    navigateGraphToEnd(graph, caveOut, pathTravelled);
  });
};

const isCaveSmall = (cave) => cave === cave.toLowerCase();

const pathHasVisitedCave = (path, cave) => path.split(",").includes(cave);

const pathHasVisitedAnySmallCaveTwice = (path) => {
  const visitedCaves = path.split(",");
  const alreadyVisitedCave = {};
  for (let i = 0; i < visitedCaves.length; i++) {
    const cave = visitedCaves[i];
    if (isCaveSmall(cave) && alreadyVisitedCave[cave] === true) {
      return true;
    }

    alreadyVisitedCave[cave] = true;
  }

  return false;
};
