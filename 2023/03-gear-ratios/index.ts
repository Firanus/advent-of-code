import path from "path";
import fs from "fs";

interface PartNumber {
  numStr: string;
  xMin: number;
  xMax: number;
  y: number;
}

interface Symbol {
  symbol: string;
  x: number;
  y: number;
}

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const rows = data.split("\n");
    let symbols: Symbol[] = [];
    let partNumbers: PartNumber[] = [];

    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[y].length; x++) {
        const symbol = rows[y][x];
        if (symbol === ".") {
          continue;
        } else if (symbol >= "0" && symbol <= "9") {
          const existingPart = partNumbers.find(
            (partNumber) => partNumber.xMax === x - 1 && partNumber.y === y
          );
          if (existingPart) {
            existingPart.xMax = x;
            existingPart.numStr += symbol;
          } else {
            partNumbers.push({
              numStr: symbol,
              xMin: x,
              xMax: x,
              y,
            });
          }
        } else {
          symbols.push({
            symbol,
            x,
            y,
          });
        }
      }
    }

    const includedParts = partNumbers.filter((partNumber) =>
      symbols.some(
        (symbol) =>
          (symbol.y === partNumber.y ||
            symbol.y === partNumber.y + 1 ||
            symbol.y === partNumber.y - 1) &&
          symbol.x >= partNumber.xMin - 1 &&
          symbol.x <= partNumber.xMax + 1
      )
    );

    console.log(
      "Part 1 Solution -",
      includedParts
        .map((part) => parseInt(part.numStr, 10))
        .reduce((acc, curr) => acc + curr, 0)
    );

    const gears = symbols.filter((symbol) => {
      const isLabelledCorrect = symbol.symbol === "*";
      const nearbyPartsCount = partNumbers.filter(
        (partNumber) =>
          (partNumber.y === symbol.y ||
            partNumber.y === symbol.y + 1 ||
            partNumber.y === symbol.y - 1) &&
          partNumber.xMin - 1 <= symbol.x &&
          partNumber.xMax + 1 >= symbol.x
      ).length;
      return isLabelledCorrect && nearbyPartsCount > 1;
    });

    const gearRatios = gears.map((gear) => {
      const nearbyParts = partNumbers.filter(
        (partNumber) =>
          (partNumber.y === gear.y ||
            partNumber.y === gear.y + 1 ||
            partNumber.y === gear.y - 1) &&
          partNumber.xMin - 1 <= gear.x &&
          partNumber.xMax + 1 >= gear.x
      );
      const partNumVals = nearbyParts.map((partNumber) =>
        parseInt(partNumber.numStr)
      );
      return partNumVals.reduce((acc, curr) => acc * curr, 1);
    });

    console.log(
      "Part 2 Solution -",
      gearRatios.reduce((acc, curr) => acc + curr, 0)
    );
  }
);
