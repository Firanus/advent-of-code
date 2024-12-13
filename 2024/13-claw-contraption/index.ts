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

    const rawEquations = data.split("\n\n")
    const equations: Equation[] = rawEquations.map(equation => {
      const [buttonA, buttonB, prize] = equation.split("\n")
      const buttonAX = parseInt(buttonA.slice(buttonA.indexOf('X+') + 2, buttonA.indexOf(',')).trim(), 10)
      const buttonAY = parseInt(buttonA.slice(buttonA.indexOf('Y+') + 2).trim(), 10)
      const buttonBX = parseInt(buttonB.slice(buttonB.indexOf('X+') + 2, buttonB.indexOf(',')).trim(), 10)
      const buttonBY = parseInt(buttonB.slice(buttonB.indexOf('Y+') + 2).trim(), 10)
      const prizeX = parseInt(prize.slice(prize.indexOf('X=') + 2, prize.indexOf(',')).trim(), 10)
      const prizeY = parseInt(prize.slice(prize.indexOf('Y=') + 2).trim(), 10)
      return {
        buttonA: { x: buttonAX, y: buttonAY },
        buttonB: { x: buttonBX, y: buttonBY },
        prize: { x: prizeX, y: prizeY }
      }
    })

    console.log("Part 1 Solution - ", calculateSolution(equations, 0));
    console.log("Part 2 Solution - ", calculateSolution(equations, 10000000000000));
  }
);

interface Equation {
    buttonA: { x: number, y: number },
    buttonB: { x: number, y: number },
    prize: { x: number, y: number }
}

const calculateSolution = (equations: Equation[], prizeIncrement: number) => {
    return equations.reduce((acc, equation) => {
        const { buttonA, buttonB, prize } = equation
        const truePrize = { x: prize.x + prizeIncrement, y: prize.y + prizeIncrement }
        const distanceB = (buttonA.x * truePrize.y - buttonA.y * truePrize.x) / (buttonA.x * buttonB.y - buttonA.y * buttonB.x);
        const distanceA = (truePrize.x - distanceB * buttonB.x) / buttonA.x

        if (Number.isInteger(distanceA) && Number.isInteger(distanceB)) {
            return acc + 3 * distanceA + distanceB
        }

        return acc;
    }, 0)
}