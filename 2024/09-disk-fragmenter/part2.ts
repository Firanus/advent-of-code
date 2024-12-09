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

    const rawData = data.split("").map((char) => parseInt(char, 10));

    // Create an array of dense inputs.
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

    // Iterate from both ends.
    const finalDisk: number[] = [];
    while (denseData.length > 0) {
      const [id, length] = denseData.shift()!;
      if (id !== undefined) {
        finalDisk.push(...new Array(length).fill(id));
      } else {
        let lengthToFill = length;
        let allItemsChecked = false;
        while (lengthToFill > 0 && !allItemsChecked) {
          allItemsChecked = false;
          for (let i = denseData.length - 1; i >= 0; i--) {
            const elementFromEnd = denseData[i];
            const [endId, endLength] = elementFromEnd;

            if (endId === undefined) {
              // Pop blank spaces from the end.
              if (i === denseData.length - 1) {
                denseData.pop();
              }
              continue;
            }

            if (endLength <= lengthToFill) {
              finalDisk.push(...new Array(endLength).fill(endId));
              lengthToFill -= endLength;

              // Put in blank space to replace what we moved.
              denseData.splice(i, 1, [undefined, endLength]);
            }
            if (lengthToFill === 0) {
              break;
            }
          }

          // Put in blank space we weren't able to fill.
          finalDisk.push(...new Array(lengthToFill).fill(0));
          allItemsChecked = true;
        }
      }
    }

    const solution = finalDisk.reduce((acc, id, index) => acc + id * index, 0);
    console.log("Solution - ", solution);
  }
);
