import path from "path";
import fs from "fs";

interface Node {
  key: string;
  flowRate: number;
  nearbyNodes: Node[];
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
  return true;
};

const shouldTravelToNode = (node: Node, gameState: GameState): boolean => {
  const { previousVisitedGameStates } = gameState;
  const nodeVisits = previousVisitedGameStates.filter(
    (prev) => prev.currentNodeKey === node.key
  );

  // If you've visited this node already and haven't increased your score, going
  // backwards is strictly suboptimal, so don't. Otherwise, it's worth visiting.
  return nodeVisits.every((visit) => gameState.score > visit.score);
};

const encodeActivationPattern = (nodeKeys: string[]) => nodeKeys.join(",");

// If you get to a node to activate it, but we've already found a path that does the same activations
// you do in the same order in less time, your path is strictly suboptimal
const isLateActivation = (
  activationPattern: string[],
  timeRemaining: number,
  previousActivationPatterns: { [activationPattern: string]: number }
) => {
  const previousDiscovery =
    previousActivationPatterns[encodeActivationPattern(activationPattern)];
  if (previousDiscovery && previousDiscovery <= INITIAL_TIME - timeRemaining) {
    return true;
  }
  return false;
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

    const foundActivationPatterns: { [activationPattern: string]: number } = {};
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
      console.log(gameState.timeRemaining);

      const { previousVisitedGameStates, ...shallowGameState } = gameState;
      gameState.previousVisitedGameStates.push(
        decodeShallowGameState(encodeShallowGameState(shallowGameState)) // Dirty deep clone
      );
      gameState.timeRemaining -= 1;

      if (gameState.timeRemaining === 0) {
        finishedGames.push(gameState);
        continue;
      }

      if (
        canActivateNode(currentNode, gameState) &&
        !isLateActivation(
          [...gameState.activatedNodeKeys, currentNode.key],
          gameState.timeRemaining,
          foundActivationPatterns
        )
      ) {
        gameStatesToExplore.push(
          encodeGameState({
            ...gameState,
            activatedNodeKeys: [
              ...gameState.activatedNodeKeys,
              currentNode.key,
            ],
            score:
              gameState.score + currentNode.flowRate * gameState.timeRemaining,
          })
        );
        foundActivationPatterns[
          encodeActivationPattern([
            ...gameState.activatedNodeKeys,
            currentNode.key,
          ])
        ] = INITIAL_TIME - gameState.timeRemaining;
        // console.log(foundActivationPatterns);
      }

      const nearbyNodes = currentNode.nearbyNodes;
      nearbyNodes.forEach((nodeToMoveTo) => {
        if (shouldTravelToNode(nodeToMoveTo, gameState)) {
          gameStatesToExplore.push(
            encodeGameState({
              ...gameState,
              currentNodeKey: nodeToMoveTo.key,
            })
          );
        }
      });
    }

    const gamesByScore = finishedGames.sort((a, b) => b.score - a.score);
    console.log(gamesByScore[0]);
  }
);

// if (actorToAction.canActivateCurrentNode) {
//   const node = nodeMap[actorToAction.currentNodeKey];
//   gameState.activatedNodeKeys.push(actorToAction.currentNodeKey);
//   gameState.score += (actorToAction.timeRemaining - 1) * node.flowRate;

//   actorToAction.canActivateCurrentNode = false;
//   actorToAction.timeRemaining -= 1;

//   const existingListOfScoresAtTime =
//     iterationsOfScoresAtGivenTime[actorToAction.timeRemaining];
//   if (existingListOfScoresAtTime) {
//     // Try pruning unlikely paths
//     if (
//       existingListOfScoresAtTime.length > 10 &&
//       existingListOfScoresAtTime[0] * 0.3 > gameState.score
//     ) {
//       continue;
//     }

//     existingListOfScoresAtTime.push(gameState.score);
//     const newListOfExistingScores = existingListOfScoresAtTime.sort(
//       (a, b) => b - a
//     );
//     iterationsOfScoresAtGivenTime[actorToAction.timeRemaining] =
//       newListOfExistingScores;
//   } else {
//     iterationsOfScoresAtGivenTime[actorToAction.timeRemaining] = [
//       gameState.score,
//     ];
//   }
// }
