import path from "path";
import fs from "fs";

interface Layer {
  raw: number[][];
  countOfZeros: number;
  countOfOnes: number;
  countOfTwos: number;
}

const imageWidth = 25;
const imageHeight = 6;
const imageSize = imageWidth * imageHeight;

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const digits = data.split("").map((x) => parseInt(x, 10));

    const layers: Layer[] = [];
    for (let i = 0; i < digits.length; i++) {
      const layerIndex = Math.floor(i / imageSize);
      const positionIndex = Math.floor(i % imageSize);
      const xPosition = positionIndex % imageWidth;
      const yPosition = Math.floor(positionIndex / imageWidth);

      const currentLayer: Layer = layers[layerIndex] ?? {
        raw: [],
        countOfZeros: 0,
        countOfOnes: 0,
        countOfTwos: 0,
      };

      const currentRow = currentLayer.raw[yPosition] ?? [];
      currentRow[xPosition] = digits[i];

      switch (digits[i]) {
        case 0:
          currentLayer.countOfZeros += 1;
          break;
        case 1:
          currentLayer.countOfOnes += 1;
          break;
        case 2:
          currentLayer.countOfTwos += 1;
          break;
      }
      currentLayer.raw[yPosition] = currentRow;
      layers[layerIndex] = currentLayer;
    }

    const layerWithFewestZeros = layers.reduce(
      (acc, curr) => (curr.countOfZeros < acc.countOfZeros ? curr : acc),
      layers[0]
    );

    console.log(
      "Part 1 Answer",
      layerWithFewestZeros.countOfOnes * layerWithFewestZeros.countOfTwos
    );

    const finalImage: number[][] = new Array(imageHeight)
      .fill(-1)
      .map(() => new Array(imageWidth));

    for (let i = 0; i < imageHeight; i++) {
      for (let j = 0; j < imageWidth; j++) {
        for (let k = 0; k < layers.length; k++) {
          let currentPixel = layers[k].raw[i][j];
          if (currentPixel === 0 || currentPixel === 1) {
            finalImage[i][j] = currentPixel;
            break;
          }
        }
      }
    }

    const finalImageForDisplay = finalImage
      .map((row) => row.map((pixel) => (pixel === 0 ? " " : "|")).join(""))
      .join("\n");

    console.log("Part 2 Answer: ");
    console.log(finalImageForDisplay);
  }
);
