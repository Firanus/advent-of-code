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
  timeRemaining: number;
  score: number;
  currentNodeKey: string;
  activatedNodeKeys: string[];
  previousVisitedGameStates: ShallowGameState[];
}

interface DjikstraNode {
  node: Node;
  visited: boolean;
  tentativeDistance: number;
}

interface DjikstraNodeMap {
  [nodeKey: string]: DjikstraNode;
}

type ShallowGameState = Omit<GameState, "previousVisitedGameStates">;

const encodeGameState = (gameState: GameState): string => {
  const { previousVisitedGameStates, ...shallowGameState } = gameState;

  return `${encodeShallowGameState(
    shallowGameState
  )}-[${previousVisitedGameStates.map(encodeShallowGameState).join(":")}]`;
};

const encodeShallowGameState = (gameState: ShallowGameState): string => {
  const { timeRemaining, score, currentNodeKey, activatedNodeKeys } = gameState;

  return `${currentNodeKey}-${score}-${timeRemaining}-${activatedNodeKeys.join(
    ","
  )}`;
};

const decodeGameState = (encodedState: string): GameState => {
  const indexOfPreviousStatesStarting = encodedState.indexOf("[");
  const currentState = encodedState.slice(0, indexOfPreviousStatesStarting);
  const previousStatesString = encodedState.slice(
    indexOfPreviousStatesStarting + 1,
    -1
  );
  const previousStateStrings = previousStatesString.length
    ? previousStatesString.split(":")
    : [];

  return {
    ...decodeShallowGameState(currentState),
    previousVisitedGameStates: previousStateStrings.map(decodeShallowGameState),
  };
};

const decodeShallowGameState = (shallowGameState: string): ShallowGameState => {
  const [
    currentNodeKey,
    scoreString,
    timeRemainingString,
    activatedNodeKeysString,
  ] = shallowGameState.split("-");

  return {
    currentNodeKey,
    score: parseInt(scoreString, 10),
    timeRemaining: parseInt(timeRemainingString, 10),
    activatedNodeKeys: activatedNodeKeysString?.length
      ? activatedNodeKeysString.split(",")
      : [],
  };
};

const canActivateNode = (node: Node, gameState: GameState): boolean => {
  if (node.flowRate === 0) {
    return false;
  }
  if (gameState.activatedNodeKeys.includes(node.key)) {
    return false;
  }
  if (gameState.timeRemaining < 1) {
    return false;
  }
  return true;
};

const getReachableNodes = (node: Node, gameState: GameState): string[] => {
  const distanceNodeKeys = Object.keys(node.shortestDistancesToNodesWithFlow);

  const reachableNodes: string[] = [];

  distanceNodeKeys.forEach((distanceNodeKey) => {
    const distanceToNode =
      node.shortestDistancesToNodesWithFlow[distanceNodeKey];
    const hasTimeToReachNode = gameState.timeRemaining - distanceToNode > 0;

    const isNodeActivated =
      gameState.activatedNodeKeys.includes(distanceNodeKey);
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

const INITIAL_TIME = 30;

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
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

    const initialGameState: GameState = {
      currentNodeKey: "AA",
      timeRemaining: INITIAL_TIME,
      score: 0,
      activatedNodeKeys: [],
      previousVisitedGameStates: [],
    };

    const gameStatesToExplore: string[] = [encodeGameState(initialGameState)];

    const finishedGames: GameState[] = [];

    while (gameStatesToExplore.length) {
      const gameStateString = gameStatesToExplore.shift()!;
      const gameState = decodeGameState(gameStateString);
      const currentNode = nodeMap[gameState.currentNodeKey];
      console.log(gameStatesToExplore.length);

      const { previousVisitedGameStates, ...shallowGameState } = gameState;
      gameState.previousVisitedGameStates.push(
        decodeShallowGameState(encodeShallowGameState(shallowGameState)) // Dirty deep clone
      );

      const reachableNodes = getReachableNodes(currentNode, gameState);

      if (!canActivateNode(currentNode, gameState) && !reachableNodes.length) {
        finishedGames.push(gameState);
        continue;
      }

      if (canActivateNode(currentNode, gameState)) {
        gameStatesToExplore.push(
          encodeGameState({
            ...gameState,
            activatedNodeKeys: [
              ...gameState.activatedNodeKeys,
              currentNode.key,
            ],
            score:
              gameState.score +
              currentNode.flowRate * (gameState.timeRemaining - 1),
            timeRemaining: gameState.timeRemaining - 1,
          })
        );
        continue;
      }

      reachableNodes.forEach((distanceNodeKey) => {
        const distanceToNode =
          currentNode.shortestDistancesToNodesWithFlow[distanceNodeKey];
        const hasTimeToReachNode = gameState.timeRemaining - distanceToNode > 0;
        if (
          !gameState.activatedNodeKeys.includes(distanceNodeKey) &&
          hasTimeToReachNode
        ) {
          gameStatesToExplore.push(
            encodeGameState({
              ...gameState,
              currentNodeKey: distanceNodeKey,
              timeRemaining: gameState.timeRemaining - distanceToNode,
            })
          );
        }
      });
    }

    const gamesByScore = finishedGames.sort((a, b) => b.score - a.score);
    console.log(gamesByScore[0]);
  }
);
