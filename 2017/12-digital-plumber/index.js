const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const allVillagerPipes = data.split("\n").map((datum) => {
    const outgoing = datum
      .split(" <-> ")[1]
      .split(", ")
      .map((x) => parseInt(x, 10));
    return {
      outgoingPipes: outgoing,
      groupIndex: undefined,
    };
  });

  let groupIndex = 0;
  for (let i = 0; i < allVillagerPipes.length; i++) {
    const currentPipe = allVillagerPipes[i];
    if (currentPipe.groupIndex !== undefined) {
      continue;
    }

    allVillagerPipes[i].groupIndex = groupIndex;
    const pipesToVisit = [...currentPipe.outgoingPipes];

    while (pipesToVisit.length > 0) {
      const visitingPipeIndex = pipesToVisit.shift();
      const visitingPipe = allVillagerPipes[visitingPipeIndex];
      allVillagerPipes[visitingPipeIndex].groupIndex = groupIndex;

      for (let j = 0; j < visitingPipe.outgoingPipes.length; j++) {
        const outgoingPipeIndex = visitingPipe.outgoingPipes[j];
        if (allVillagerPipes[outgoingPipeIndex].groupIndex === undefined) {
          pipesToVisit.push(outgoingPipeIndex);
        }
      }
    }

    groupIndex += 1;
  }

  const pipeGroups = allVillagerPipes.reduce((acc, curr) => {
    if (acc[curr.groupIndex] === undefined) {
      acc[curr.groupIndex] = 1;
    } else {
      acc[curr.groupIndex] += 1;
    }
    return acc;
  }, {});

  console.log("Part 1 Answer:", pipeGroups["0"]);
  console.log("Part 2 Answer:", Object.keys(pipeGroups).length);
});
