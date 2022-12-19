import path from "path";
import fs from "fs";

interface Node {
  key: string;
  flowRate: number;
  nearbyNodes: Node[];
  shortestDistancesToNodesWithFlow: { [nodeKey: string]: number };
}

interface NodeMap {
  [nodeKey: string]: Node;
}

interface GameState {
  score: number;
  activatedNodeKeys: string[];
  actors: Actor[];
}

interface Actor {
  index: string;
  currentNodeKey: string;
  timeRemaining: number;
  reachableNodeKeys: string[];
  canActivateCurrentNode: boolean;
}

interface DjikstraNode {
  node: Node;
  visited: boolean;
  tentativeDistance: number;
}

interface DjikstraNodeMap {
  [nodeKey: string]: DjikstraNode;
}

const encodeGameState = (gameState: GameState): string => {
  const { score, activatedNodeKeys, actors } = gameState;

  return `${score}-${activatedNodeKeys.join(",")}-${actors
    .map(encodeActor)
    .join("_")}`;
};
const encodeActor = (actor: Actor): string =>
  `${actor.index}:${actor.currentNodeKey}:${
    actor.timeRemaining
  }:${actor.reachableNodeKeys.join(",")}:${
    actor.canActivateCurrentNode ? 1 : 0
  }`;
const decodeActor = (actorString: string): Actor => {
  const [
    index,
    currentNodeKey,
    timeRemainingString,
    reachableNodeKeysString,
    canActivateCurrentNodeString,
  ] = actorString.split(":");
  return {
    index,
    currentNodeKey,
    timeRemaining: parseInt(timeRemainingString, 10),
    reachableNodeKeys: reachableNodeKeysString.length
      ? reachableNodeKeysString.split(",")
      : [],
    canActivateCurrentNode: canActivateCurrentNodeString === "1",
  };
};

const decodeGameState = (gameState: string): GameState => {
  const [scoreString, activatedNodeKeysString, actorsString] =
    gameState.split("-");

  return {
    score: parseInt(scoreString, 10),
    activatedNodeKeys: activatedNodeKeysString?.length
      ? activatedNodeKeysString.split(",")
      : [],
    actors: actorsString?.length
      ? actorsString.split("_").map(decodeActor)
      : [],
  };
};

const encodeBestVerticesKey = (activatedNodes: string[]): string =>
  activatedNodes.sort().join(",");

const canActorActivateNode = (
  node: Node,
  actorTimeRemaining: number,
  activatedNodeKeys: string[]
): boolean => {
  if (node.flowRate === 0) {
    return false;
  }
  if (activatedNodeKeys.includes(node.key)) {
    return false;
  }
  if (actorTimeRemaining < 1) {
    return false;
  }
  return true;
};

const getReachableNodesForActor = (
  actorCurrentNodeKey: string,
  actorTimeRemaining: number,
  nodeMap: NodeMap,
  activatedNodeKeys: string[]
): string[] => {
  const node = nodeMap[actorCurrentNodeKey];
  const distanceNodeKeys = Object.keys(node.shortestDistancesToNodesWithFlow);

  const reachableNodes: string[] = [];

  distanceNodeKeys.forEach((distanceNodeKey) => {
    const distanceToNode =
      node.shortestDistancesToNodesWithFlow[distanceNodeKey];
    const hasTimeToReachNode = actorTimeRemaining - distanceToNode > 1;

    const isNodeActivated = activatedNodeKeys.includes(distanceNodeKey);
    if (hasTimeToReachNode && !isNodeActivated) {
      reachableNodes.push(distanceNodeKey);
    }
  });

  return reachableNodes;
};

const findShortestPathBetweenTwoNodes = (
  startNode: Node,
  endNode: Node,
  nodeMap: NodeMap
): number => {
  const djikstraNodeMap = Object.values(nodeMap).reduce<DjikstraNodeMap>(
    (acc, baseNode) => {
      const dNode: DjikstraNode = {
        node: baseNode,
        visited: false,
        tentativeDistance:
          baseNode.key === startNode.key ? 0 : Number.POSITIVE_INFINITY,
      };
      acc[baseNode.key] = dNode;
      return acc;
    },
    {}
  );

  let nodesToTraverse = [djikstraNodeMap[startNode.key]];
  let hasVisitedFinishingNode = false;
  let minDistance = -1;
  while (nodesToTraverse.length > 0 && !hasVisitedFinishingNode) {
    const visitingNode = nodesToTraverse.shift()!;
    const { tentativeDistance, node } = visitingNode;

    const nodesToCheck = node.nearbyNodes;

    for (let i = 0; i < nodesToCheck.length; i++) {
      const key = nodesToCheck[i].key;
      const dNode = djikstraNodeMap[key];
      if (!dNode.visited) {
        dNode.tentativeDistance = Math.min(
          dNode.tentativeDistance,
          tentativeDistance + 1
        );
        nodesToTraverse.push(dNode);
      }
    }

    visitingNode.visited = true;
    if (visitingNode.node.key === endNode.key) {
      hasVisitedFinishingNode = true;
      minDistance = tentativeDistance;
    }

    // In a perfect world, we'd use a minHeap. Fof the purposes here, a regular
    // array with a simple nlgn sort will be fine;
    nodesToTraverse = nodesToTraverse
      .filter((x) => !x.visited)
      .sort((a, b) => a.tentativeDistance - b.tentativeDistance);
  }
  return minDistance;
};

// Loose function that tells us the absolute maximum score you'd get
// if you turned on every valve simultaneous with the current amount
// of time you have left

// NOT DONE. FIX THIS.
const getUpperLimitGameScore = (gameState: GameState, nodeMap: NodeMap) => {
  const nodesWithFlows = Object.values(nodeMap).filter((n) => n.flowRate > 0);
  const currentScore = gameState.score;
  let maxScore = currentScore;

  const taggedNodeKeys = [...gameState.activatedNodeKeys];

  const getActorTimeNodeActivated = (
    actor: Actor,
    destinationNodeKey: string
  ): number => {
    const startNode = nodeMap[actor.currentNodeKey];
    const distanceToNode =
      startNode.shortestDistancesToNodesWithFlow[destinationNodeKey];
    return actor.timeRemaining - distanceToNode - 1;
  };

  nodesWithFlows.forEach((node) => {
    const possibleActors = gameState.actors.filter((a) =>
      a.reachableNodeKeys.includes(node.key)
    );
    possibleActors.sort(
      (a, b) =>
        getActorTimeNodeActivated(b, node.key) -
        getActorTimeNodeActivated(a, node.key)
    );
    if (!possibleActors.length) {
      return;
    }
    const bestActor = possibleActors[0];
    const actorNode = nodeMap[bestActor.currentNodeKey];
    maxScore +=
      (bestActor.timeRemaining -
        actorNode.shortestDistancesToNodesWithFlow[node.key] -
        1) *
      node.flowRate;
    taggedNodeKeys.push(node.key);
  });

  return maxScore;
};

fs.readFile(
  path.resolve(__dirname, "./testInput.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const inputStrings = data.split("\n");
    const nodeMap = inputStrings.reduce<NodeMap>((acc, curr) => {
      const valveKeyRegex = /(?<=Valve ).*?(?= has)/;
      const flowRateRegex = /(?<=has flow rate=).*?(?=;)/;

      const valveKey = curr.match(valveKeyRegex)?.[0];
      const flowRateString = curr.match(flowRateRegex)?.[0];

      if (!valveKey || !flowRateString) {
        throw new Error("Failed to parse node");
      }
      const newNode: Node = {
        key: valveKey,
        flowRate: parseInt(flowRateString),
        nearbyNodes: [],
        shortestDistancesToNodesWithFlow: {},
      };
      acc[valveKey] = newNode;
      return acc;
    }, {});
    inputStrings.forEach((inputString) => {
      const valveKeyRegex = /(?<=Valve ).*?(?= has)/;
      const nearbyNodesRegex = /(?<=tunnel(s?) lead(s?) to valve(s?) ).*?$/;

      const valveKey = inputString.match(valveKeyRegex)?.[0];
      const nearbyNodeKeys = inputString
        .match(nearbyNodesRegex)?.[0]
        ?.split(", ");
      if (!valveKey || !nearbyNodeKeys) {
        throw new Error("Failed to parse nearby node keys");
      }

      const mainNode = nodeMap[valveKey];
      const nearbyNodes: Node[] = [];
      nearbyNodeKeys.forEach((key) => {
        nearbyNodes.push(nodeMap[key]);
      });
      mainNode.nearbyNodes = nearbyNodes;
    });

    const nodesWithFlows = Object.values(nodeMap).filter((x) => x.flowRate);
    const startNode = nodeMap["AA"];
    [startNode, ...nodesWithFlows].forEach((node) => {
      for (let i = 0; i < nodesWithFlows.length; i++) {
        const nodeWithFlow = nodesWithFlows[i];
        if (nodeWithFlow.key === node.key) {
          continue;
        }

        node.shortestDistancesToNodesWithFlow[nodeWithFlow.key] =
          findShortestPathBetweenTwoNodes(node, nodeWithFlow, nodeMap);
      }
    });

    const runGameWithActors = (
      actorCount: number,
      initialTime: number,
      startingNodeKey: string
    ): number => {
      const initialGameState: GameState = {
        actors: [...Array(actorCount)].map((_, index) => ({
          index: index.toString(),
          currentNodeKey: startingNodeKey,
          timeRemaining: initialTime,
          canActivateCurrentNode: canActorActivateNode(
            nodeMap[startingNodeKey],
            initialTime,
            []
          ),
          reachableNodeKeys: getReachableNodesForActor(
            startingNodeKey,
            initialTime,
            nodeMap,
            []
          ),
        })),
        score: 0,
        activatedNodeKeys: [],
      };

      const gameStatesToExplore: string[] = [encodeGameState(initialGameState)];
      const bestIterationsOfVertices: {
        [verticesKey: string]: number;
      } = {};
      const iterationsOfScoresAtGivenTime: {
        [timeRemaining: number]: number[];
      } = {};

      let bestGame: GameState = initialGameState;

      let iterationCount = 0;
      while (gameStatesToExplore.length) {
        iterationCount += 1;
        console.log(iterationCount, gameStatesToExplore.length, bestGame.score);
        const gameStateString = gameStatesToExplore.shift()!;
        const gameState = decodeGameState(gameStateString);

        const currentUpperLimitScore = getUpperLimitGameScore(
          gameState,
          nodeMap
        );

        // if (shouldLog) {
        //   console.log("initial game state", JSON.stringify(gameState, null, 2));
        // }
        if (currentUpperLimitScore < bestGame.score) {
          continue;
        }

        const { actors } = gameState;

        // Then, we move and calculate new states
        // We move the actor with more time.
        const actorToAction = actors.reduce<Actor>((acc, curr) => {
          if (!acc.canActivateCurrentNode && !acc.reachableNodeKeys.length) {
            return curr;
          }
          if (!curr.canActivateCurrentNode && !curr.reachableNodeKeys.length) {
            return acc;
          }

          if (acc.timeRemaining === curr.timeRemaining) {
            if (acc.canActivateCurrentNode) {
              return acc;
            } else if (curr.canActivateCurrentNode) {
              return curr;
            }
          }
          return acc.timeRemaining > curr.timeRemaining ? acc : curr;
        }, actors[0]);
        if (
          !actorToAction.canActivateCurrentNode &&
          !actorToAction.reachableNodeKeys.length
        ) {
          continue;
        }

        // First, we activate if we can;
        let activatedNodeCount = gameState.activatedNodeKeys.length;

        let didActivate = false;
        if (actorToAction.canActivateCurrentNode) {
          const newTime = actorToAction.timeRemaining - 1;
          const node = nodeMap[actorToAction.currentNodeKey];
          gameState.activatedNodeKeys.push(actorToAction.currentNodeKey);
          gameState.score += newTime * node.flowRate;

          actorToAction.canActivateCurrentNode = false;
          actorToAction.timeRemaining = newTime;
          didActivate = true;

          // const existingListOfScoresAtTime =
          //   iterationsOfScoresAtGivenTime[newTime];
          // if (existingListOfScoresAtTime) {
          //   // Try pruning unlikely paths
          //   if (
          //     existingListOfScoresAtTime.length > 10 &&
          //     existingListOfScoresAtTime[0] * 0.5 > gameState.score
          //   ) {
          //     continue;
          //   }

          //   existingListOfScoresAtTime.push(gameState.score);
          //   const newListOfExistingScores = existingListOfScoresAtTime.sort(
          //     (a, b) => b - a
          //   );
          //   iterationsOfScoresAtGivenTime[newTime] = newListOfExistingScores;
          // } else {
          //   iterationsOfScoresAtGivenTime[newTime] = [gameState.score];
          // }
        }
        // const shouldLog =
        //   gameState.activatedNodeKeys.includes("BB") &&
        //   gameState.activatedNodeKeys.includes("DD") &&
        //   gameState.activatedNodeKeys.includes("HH") &&
        //   gameState.activatedNodeKeys.includes("JJ") &&
        //   gameState.activatedNodeKeys.length === 4;
        // if (shouldLog && didActivate) {
        //   console.log("gameState after activation", gameState);
        // }

        // If we get to a vertex combination we've seen, less optimally then
        // before, stop exploring. Otherwise, update the best total.
        // if (activatedNodeCount < gameState.activatedNodeKeys.length) {
        //   const existingBestIterationOfVerticesScore =
        //     bestIterationsOfVertices[
        //       encodeBestVerticesKey(gameState.activatedNodeKeys)
        //     ] ?? Number.NEGATIVE_INFINITY;
        //   // if (shouldLog) {
        //   //   console.log("bestIterations", bestIterationsOfVertices);
        //   // }
        //   if (existingBestIterationOfVerticesScore <= gameState.score) {
        //     // if (shouldLog) {
        //     //   console.log("bestIterations UPDATED", bestIterationsOfVertices);
        //     // }
        //     bestIterationsOfVertices[
        //       encodeBestVerticesKey(gameState.activatedNodeKeys)
        //     ] = gameState.score;
        //   } else {
        //     // if (shouldLog) {
        //     //   console.log("FILTERED", bestIterationsOfVertices);
        //     // }
        //     if (existingBestIterationOfVerticesScore * 0.8 > gameState.score) {
        //       continue;
        //     }
        //   }
        // }

        if (gameState.score > bestGame.score) {
          bestGame = gameState;
        }

        if (didActivate) {
          gameStatesToExplore.push(encodeGameState(gameState));
          continue;
        }

        const newGameStates: GameState[] = actorToAction.reachableNodeKeys
          .map((reachableNodeKey) => {
            const node = nodeMap[actorToAction.currentNodeKey];
            const newTimeRemaining =
              actorToAction.timeRemaining -
              node.shortestDistancesToNodesWithFlow[reachableNodeKey];
            const newActors = [...actors]
              .filter((a) => a.index !== actorToAction.index)
              .map((newActor) => ({
                ...newActor,
                reachableNodeKeys: [
                  ...newActor.reachableNodeKeys.filter(
                    (key) => key !== reachableNodeKey
                  ),
                ],
              }));
            newActors.push({
              index: actorToAction.index,
              currentNodeKey: reachableNodeKey,
              timeRemaining: newTimeRemaining,
              canActivateCurrentNode: canActorActivateNode(
                nodeMap[reachableNodeKey],
                newTimeRemaining,
                gameState.activatedNodeKeys
              ),
              reachableNodeKeys: getReachableNodesForActor(
                reachableNodeKey,
                newTimeRemaining,
                nodeMap,
                gameState.activatedNodeKeys
              ),
            });
            return {
              ...gameState,
              actors: newActors,
            };
          })
          .filter((gs) => {
            const actorLocations = gs.actors.map((x) => x.currentNodeKey);
            const hasOverlap =
              actorLocations.length >
              Array.from(new Set(actorLocations)).length;
            return !hasOverlap;
          });

        // if (shouldLog) {
        //   console.log("new game states", newGameStates);
        // }
        gameStatesToExplore.push(...newGameStates.map(encodeGameState));
        gameStatesToExplore.sort(
          (a, b) =>
            decodeGameState(b).activatedNodeKeys.length -
            decodeGameState(a).activatedNodeKeys.length
        );
      }

      // console.log(bestGame);
      return bestGame.score;
    };

    // const part1 = runGameWithActors(1, 30, "AA");
    // console.log("Part 1 Solution:", part1);
    const part2 = runGameWithActors(2, 26, "AA");
    console.log("Part 2 Solution:", part2); // 2790
  }
);
