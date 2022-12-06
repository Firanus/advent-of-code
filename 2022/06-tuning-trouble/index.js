const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const findFirstIndexWithDistinctCharacters = (characterCount) => {
    for (let i = characterCount; i <= data.length; i++) {
      const characters = data.slice(i - characterCount, i).split("");
      const hashMap = {};
      characters.forEach((char) => {
        if (!hashMap[char]) {
          hashMap[char] = 1;
        } else {
          hashMap[char] = hashMap[char] + 1;
        }
      });

      const hasRepeat = Object.values(hashMap).filter((x) => x > 1).length > 0;
      if (!hasRepeat) {
        return i;
      }
    }
  };

  console.log("Part 1 Solution: ", findFirstIndexWithDistinctCharacters(4));
  console.log("Part 2 Solution: ", findFirstIndexWithDistinctCharacters(14));
});
