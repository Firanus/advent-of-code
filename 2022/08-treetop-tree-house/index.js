const path = require("path");
const fs = require("fs");

const isTreeVisible = (rowIndex, colIndex, grid) => {
  const tree = grid[rowIndex][colIndex];
  const row = grid[rowIndex];
  const column = grid.map((r) => r[colIndex]);

  if (
    rowIndex === 0 ||
    colIndex === 0 ||
    rowIndex === row.length - 1 ||
    colIndex === column.length - 1
  ) {
    return true;
  }

  const visibleFromLeft = row.slice(0, colIndex).every((lTree) => lTree < tree);
  const visibleFromRight = row
    .slice(colIndex + 1)
    .every((rTree) => rTree < tree);
  const visibleFromTop = column
    .slice(0, rowIndex)
    .every((uTree) => uTree < tree);
  const visibleFromBottom = column
    .slice(rowIndex + 1)
    .every((bTree) => bTree < tree);

  return (
    visibleFromLeft || visibleFromRight || visibleFromTop || visibleFromBottom
  );
};

const getVisibleTreesInLine = (treeHeight, treeLine) => {
  const distanceToBlockingTree = treeLine.findIndex((t) => t >= treeHeight);
  return distanceToBlockingTree === -1
    ? treeLine.length
    : distanceToBlockingTree + 1;
};

const getScenicScore = (rowIndex, colIndex, grid) => {
  const tree = grid[rowIndex][colIndex];
  const row = grid[rowIndex];
  const column = grid.map((r) => r[colIndex]);

  const visibleToLeft = getVisibleTreesInLine(
    tree,
    row.slice(0, colIndex).reverse()
  );
  const visibleToRight = getVisibleTreesInLine(tree, row.slice(colIndex + 1));
  const visibleToTop = getVisibleTreesInLine(
    tree,
    column.slice(0, rowIndex).reverse()
  );
  const visibleToBottom = getVisibleTreesInLine(
    tree,
    column.slice(rowIndex + 1)
  );

  return visibleToLeft * visibleToRight * visibleToBottom * visibleToTop;
};

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const treeGrid = data
    .split("\n")
    .map((row) => row.split("").map((tree) => parseInt(tree, 10)));

  let visibleCount = 0;
  let bestScenicScore = -1;
  for (let i = 0; i < treeGrid.length; i++) {
    for (let j = 0; j < treeGrid[i].length; j++) {
      if (isTreeVisible(i, j, treeGrid)) {
        visibleCount += 1;
      }
      bestScenicScore = Math.max(
        bestScenicScore,
        getScenicScore(i, j, treeGrid)
      );
    }
  }

  console.log("Part 1 Solution -", visibleCount);
  console.log("Part 2 Solution -", bestScenicScore);
});
