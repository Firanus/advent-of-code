import path from "path";
import fs from "fs";

const encode = (num: number) => num.toString();
const decode = (str: string) => parseInt(str, 10);

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const stones: number[] = data.split(' ').map((s) => parseInt(s, 10))

    console.log("Part 1 Solution - ", iterateOverStones(stones, 25));
    console.log("Part 2 Solution - ", iterateOverStones(stones, 75));
  }
);

const iterateOverStones = (stones: number[], iterations: number) => {
    let countsOfNumbers: {[key: string]: number} = {};
    for (let i = 0; i < stones.length; i++) {
        const key = encode(stones[i]);
        if (!countsOfNumbers[key]) {
            countsOfNumbers[key] = 1;
        } else {
            countsOfNumbers[key] += 1;        
        }
    }

    for (let i = 0; i < iterations; i++) {
        const newCounts: {[key: string]: number} = {};
        Object.keys(countsOfNumbers).forEach((key) => {
            const val = decode(key);
            const count = countsOfNumbers[key];
            const result = executeRulesOnStone(val);
            result.forEach((res) => {
                const resKey = encode(res);
                if (!newCounts[resKey]) {
                    newCounts[resKey] = count;
                } else {
                    newCounts[resKey] += count;        
                }       
            })
        })
        countsOfNumbers = newCounts;
    }

    return Object.values(countsOfNumbers).reduce((acc, curr) => acc + curr, 0)
}

const executeRulesOnStone = (stone: number): number[] => {
    if (stone === 0) {
        return [1];
    }
    if (stone.toString().length % 2 === 0) {
        const stoneString = stone.toString();
        const leftHalf = stoneString.slice(0, stoneString.length / 2);
        const rightHalf = stoneString.slice(stoneString.length / 2);
        return [leftHalf, rightHalf].map((x) => parseInt(x, 10));
    }

    return [stone * 2024]
}
