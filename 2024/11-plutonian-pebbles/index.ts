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

    const stones: number[] = data.split(' ').map((s) => parseInt(s, 10))

    const iterations = 25;
    const finalStones: number[] = []
    for (let i = 0; i < stones.length; i++) {
        const stone = stones[i];
        let currentStones = [stone];
        for (let j = 0; j < iterations; j++) {
            const localStones = currentStones.flatMap((ls) => executeRulesOnStone(ls))
            currentStones = localStones;
        }
        finalStones.push(...currentStones);
    }

    console.log("Part 1 Solution - ", finalStones.length);
    // console.log("Part 2 Solution - ", partTwoSolution);
  }
);

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
