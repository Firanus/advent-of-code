const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let [enhancementAlgorithmString, inputImageString] = data.split("\n\n");
  let algorithm = processAlgorithm(enhancementAlgorithmString);
  let image = processImageString(inputImageString);
  let unspecifiedCharacter = ".";

  for (let i = 0; i < 50; i++) {
    image = applyAlgorithmToImage(algorithm, image, unspecifiedCharacter);
    image = processImageString(image);
    unspecifiedCharacter = getUnspecifiedCharacter(
      algorithm,
      unspecifiedCharacter
    );
  }

  const lightCount = image.reduce((acc, curr) => {
    acc += curr.filter((x) => x === "#").length;
    return acc;
  }, 0);
  console.log(lightCount);
});

const applyAlgorithmToImage = (algorithm, image, unspecifiedCharacter) => {
  let nextImage = [];
  for (let i = -1; i <= image.length; i++) {
    let row = "";
    for (let j = -1; j <= image[0].length; j++) {
      const binaryString = getBinaryStringFor(
        image,
        i,
        j,
        unspecifiedCharacter
      );
      const binaryNumber = parseInt(binaryString, 2);
      const value = algorithm[binaryNumber];
      row += value == "1" ? "#" : ".";
    }
    nextImage += i === image.length ? row : row + "\n";
  }
  return nextImage;
};

const getBinaryStringFor = (
  image,
  rowIndex,
  colIndex,
  unspecifiedCharacter
) => {
  const characterString =
    accessCharacter(image, rowIndex - 1, colIndex - 1, unspecifiedCharacter) +
    accessCharacter(image, rowIndex - 1, colIndex, unspecifiedCharacter) +
    accessCharacter(image, rowIndex - 1, colIndex + 1, unspecifiedCharacter) +
    accessCharacter(image, rowIndex, colIndex - 1, unspecifiedCharacter) +
    accessCharacter(image, rowIndex, colIndex, unspecifiedCharacter) +
    accessCharacter(image, rowIndex, colIndex + 1, unspecifiedCharacter) +
    accessCharacter(image, rowIndex + 1, colIndex - 1, unspecifiedCharacter) +
    accessCharacter(image, rowIndex + 1, colIndex, unspecifiedCharacter) +
    accessCharacter(image, rowIndex + 1, colIndex + 1, unspecifiedCharacter);

  const binaryString = characterString.split("").reduce((acc, curr) => {
    const binaryChar = curr == "#" ? "1" : 0;
    acc += binaryChar;
    return acc;
  }, "");
  return binaryString;
};

const accessCharacter = (image, rowIndex, colIndex, unspecifiedCharacter) => {
  if (
    rowIndex < 0 ||
    colIndex < 0 ||
    rowIndex >= image.length ||
    colIndex >= image.length
  ) {
    return unspecifiedCharacter;
  }

  return image[rowIndex][colIndex];
};

const getUnspecifiedCharacter = (algorithm, unspecifiedCharacter) => {
  if (unspecifiedCharacter === ".") {
    return algorithm.slice(0, 1)[0] === "1" ? "#" : ".";
  } else {
    return algorithm.slice(algorithm.length - 1)[0] === "1" ? "#" : ".";
  }
};

const processAlgorithm = (inputString) => {
  const inputChars = inputString.split("");
  const result = [];
  for (let i = 0; i < inputChars.length; i++) {
    const char = inputChars[i];
    if (char === "#") {
      result.push("1");
    } else {
      result.push("0");
    }
  }
  return result;
};

const processImageString = (imageString) => {
  const rows = imageString.split("\n");
  const result = rows.map((x) => x.split(""));
  return result;
};
