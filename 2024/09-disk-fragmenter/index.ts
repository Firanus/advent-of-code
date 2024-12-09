import path from "path";
import fs from "fs";

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Create array of dense inputs, and iterate towards middle.
    const rawData = data.split("").map((char) => parseInt(char, 10));

    let isFile = true;
    let idNumber = 0;
    const denseData: [number | undefined, number][] = [];
    for (let i = 0; i < rawData.length; i++) {
      const length = rawData[i];
      if (length > 0) {
        denseData.push([isFile ? idNumber : undefined, length]);
      }
      idNumber += isFile ? 1 : 0;
      isFile = !isFile;
    }

    const finalDisk: number[] = [];
    while (denseData.length > 0) {
      const [id, length] = denseData.shift()!;
      if (id !== undefined) {
        finalDisk.push(...new Array(length).fill(id));
      } else {
        let lengthToFill = length;
        while (lengthToFill > 0) {
          const elementFromEnd = denseData.pop()!;
          const [endId, endLength] = elementFromEnd;
          if (endId === undefined) {
            continue;
          }
          if (endLength <= lengthToFill) {
            finalDisk.push(...new Array(endLength).fill(endId));
            lengthToFill -= endLength;
          } else {
            finalDisk.push(...new Array(lengthToFill).fill(endId));
            denseData.push([endId, endLength - lengthToFill]);
            lengthToFill = 0;
          }
        }
      }
    }

    const partOneSolution = finalDisk.reduce(
      (acc, id, index) => acc + id * index,
      0
    );
    console.log("Part 1 Solution - ", partOneSolution);
    // console.log("Part 2 Solution - ", partTwoSolution);
  }
);
