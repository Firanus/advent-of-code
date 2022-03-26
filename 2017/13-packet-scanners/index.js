const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const firewall = data.split("\n").map((datum) => {
    const [position, depth] = datum.split(": ");
    return { position: parseInt(position, 10), depth: parseInt(depth, 10) };
  });

  let severityOfZeroTrip = 0;
  firewall.forEach((layer) => {
    const { position: firewallPosition, depth } = layer;
    const currentScannerPosition = getPosition(firewallPosition, depth);
    if (currentScannerPosition === 0) {
      severityOfZeroTrip += firewallPosition * depth;
    }
  });

  let initialDelay = 0;
  let doAnotherRound = true;
  while (doAnotherRound) {
    doAnotherRound = false;
    for (let i = 0; i < firewall.length; i++) {
      const layer = firewall[i];
      const { position: firewallPosition, depth } = layer;
      const currentScannerPosition = getPosition(
        firewallPosition + initialDelay,
        depth
      );
      if (currentScannerPosition === 0) {
        doAnotherRound = true;
        break;
      }
    }

    if (doAnotherRound) {
      initialDelay += 1;
    }
  }

  console.log("Part 1 Answer:", severityOfZeroTrip);
  console.log("Part 2 Answer:", initialDelay);
});

const getPosition = (picoSeconds, depth) => {
  const cycleLength = 2 * depth - 2;
  const timeSinceStartOfLastCycle = picoSeconds % cycleLength;

  if (timeSinceStartOfLastCycle < depth) {
    return timeSinceStartOfLastCycle;
  }

  const maxPosition = depth - 1;
  const positionsToIterate = picoSeconds - maxPosition;

  return maxPosition - positionsToIterate;
};
