// ------------------------------------------------------
// Inputs
// ------------------------------------------------------

// Real input
const sequenceOfLengths = "88,88,211,106,141,1,78,254,2,111,77,255,90,0,54,205";
const listSize = 256;

// Test input
// const sequenceOfLengths = "3,4,1,5";
// const listSize = 5;

// ------------------------------------------------------
// Supporting Functions
// ------------------------------------------------------

const getReversedListSection = (list, currentPosition, length) => {
  const resultList = [];
  for (let i = 0; i < length; i++) {
    resultList.push(list[(currentPosition + i) % list.length]);
  }

  return resultList.reverse();
};

const mergeLists = (originalList, injectionList, injectionListOffset) => {
  const newList = [...originalList];
  for (let i = 0; i < injectionList.length; i++) {
    newList[(i + injectionListOffset) % newList.length] = injectionList[i];
  }

  return newList;
};

// ------------------------------------------------------
// Start of Algorithm
// ------------------------------------------------------

let skipSize = 0;
let currentPosition = 0;

const lengths = sequenceOfLengths.split(",").map((x) => parseInt(x, 10));

let list = [];
for (let i = 0; i < listSize; i++) {
  list.push(i);
}

for (let i = 0; i < lengths.length; i++) {
  const injectionList = getReversedListSection(
    list,
    currentPosition,
    lengths[i]
  );
  list = mergeLists(list, injectionList, currentPosition);

  currentPosition += lengths[i] + skipSize;
  skipSize += 1;
}

console.log("Part 1 Answer:", list[0] * list[1]);
