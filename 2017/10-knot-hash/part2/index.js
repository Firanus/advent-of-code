const { createKnotHash } = require("../../createKnotHash");
// ------------------------------------------------------
// Inputs
// ------------------------------------------------------

// Real input
const input = "88,88,211,106,141,1,78,254,2,111,77,255,90,0,54,205";

// Test input
// const input = "AoC 2017";

const hash = createKnotHash(input);
console.log("Part 2 Answer:", hash);
