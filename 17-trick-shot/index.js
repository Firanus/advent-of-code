// Weird one this, it's all maths, so I just need some support.
// EDIT - Part 1 is all maths. :p

// Input Data
const yInputMax = -108;
const yInputMin = -163;
const xInputMin = 85;
const xInputMax = 145;

// Test Data
// const yInputMax = -5;
// const yInputMin = -10;
// const xInputMin = 20;
// const xInputMax = 30;

// Max height reached is just triangle number
const getTriangleNumber = (x) => (x * (x + 1)) / 2;

// To miss entirely, first step below 0 must be > yInputMin.
// Velocity from 0 for positive y-vels is -(initial-y-vel + 1)

// So, Part 1 answer is just:
const maxYVelocity = Math.abs(yInputMin) - 1;
console.log("Part 1 Answer:", getTriangleNumber(maxYVelocity));

// Part 2 is every initial velocity pair that gets a result
// in the target zone. Now we're talking.

// So, we need to find the minimum x that will get us into the target zone
// The maximum x is just xInputMax.
// Minimum is smallest triangleNumber > xInputMin && < xInputMax
// Binomial equation for that works out as:
const minXVelocity = Math.ceil((Math.sqrt(8 * xInputMin + 1) - 1) / 2);
const maxXVelocity = xInputMax;
const minYVelocity = yInputMin;

const successfulTrajectories = [];
for (let xVelIni = minXVelocity; xVelIni <= maxXVelocity; xVelIni++) {
  for (let yVelIni = minYVelocity; yVelIni <= maxYVelocity; yVelIni++) {
    let xVel = xVelIni;
    let yVel = yVelIni;
    let x = 0;
    let y = 0;

    while (x < xInputMax && y > yInputMin) {
      x += xVel;
      y += yVel;
      xVel = xVel === 0 ? 0 : xVel - 1;
      yVel -= 1;

      if (
        x >= xInputMin &&
        x <= xInputMax &&
        y <= yInputMax &&
        y >= yInputMin
      ) {
        successfulTrajectories.push([xVelIni, yVelIni]);
        break;
      }
    }
  }
}

console.log("Part 2 Answer:", successfulTrajectories.length);
