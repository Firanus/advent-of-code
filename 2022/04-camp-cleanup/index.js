const path = require("path");
const fs = require("fs");

const enumerateGroupAsSet = (cleaningAssignment) => {
  const [start, end] = cleaningAssignment
    .split("-")
    .map((x) => parseInt(x, 10));
  const sectionsCleaned = new Set();
  for (let i = start; i <= end; i++) {
    sectionsCleaned.add(i);
  }
  return sectionsCleaned;
};

const combineSets = (firstSet, secondSet) =>
  new Set([...Array.from(firstSet), ...Array.from(secondSet)]);

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const { totalOverlaps, partialOverlaps } = data.split("\n").reduce(
    (acc, curr) => {
      const [firstAssignment, secondAssignment] = curr.split(",");

      const firstSet = enumerateGroupAsSet(firstAssignment);
      const secondSet = enumerateGroupAsSet(secondAssignment);
      const combinedSet = combineSets(firstSet, secondSet);

      let { totalOverlaps, partialOverlaps } = acc;
      if (combinedSet.size < firstSet.size + secondSet.size) {
        partialOverlaps += 1;
      }
      if (combinedSet.size === Math.max(firstSet.size, secondSet.size)) {
        totalOverlaps += 1;
      }
      return { totalOverlaps, partialOverlaps };
    },
    { totalOverlaps: 0, partialOverlaps: 0 }
  );

  console.log("Part 1 Solution: ", totalOverlaps);
  console.log("Part 2 Solution: ", partialOverlaps);
});
