// ------------------------------------------------------
// Inputs
// ------------------------------------------------------

// Real input
const input = "88,88,211,106,141,1,78,254,2,111,77,255,90,0,54,205";

// Test input
// const input = "AoC 2017";

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

const listSize = 256;
let skipSize = 0;
let currentPosition = 0;

const lengths = input
  .split("")
  .map((x) => x.charCodeAt(0))
  .concat([17, 31, 73, 47, 23]);

let list = [];
for (let i = 0; i < listSize; i++) {
  list.push(i);
}

// Run 64 rounds of the knot-hashing
for (let j = 0; j < 64; j++) {
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
}

// XOR 16 bit groups together.
const hexaElements = [];
for (let i = 0; i < 16; i++) {
  const elementSection = list.slice(16 * i, 16 * i + 16);
  hexaElements.push(
    elementSection.slice(1).reduce((acc, curr) => acc ^ curr, elementSection[0])
  );
}

const hash = hexaElements.map((x) => x.toString(16).padStart(2, "0")).join("");

console.log("Part 2 Answer:", hash);
