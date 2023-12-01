const path = require("path");
const fs = require("fs");

fs.readFile(path.resolve(__dirname, "./input.txt"), "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split("\n");

  const part1Results = lines.map((line) => {
    const reverseLine = line.split("").reverse().join("");
    const firstDigit = line[line.search(/\d/)];
    const lastDigit = reverseLine[reverseLine.search(/\d/)];
    return parseInt(firstDigit + lastDigit);
  });

  console.log(
    "Part 1 Solution: ",
    part1Results.reduce((acc, curr) => acc + curr, 0)
  );

  const firstDigits = lines.map((line) => {
    const lineByChars = line.split("");

    let currentLine = "";
    for (let i = 0; i < lineByChars.length; i++) {
      currentLine += lineByChars[i];
      if (currentLine.includes("one") || currentLine.includes("1")) return "1";
      if (currentLine.includes("two") || currentLine.includes("2")) return "2";
      if (currentLine.includes("three") || currentLine.includes("3"))
        return "3";
      if (currentLine.includes("four") || currentLine.includes("4")) return "4";
      if (currentLine.includes("five") || currentLine.includes("5")) return "5";
      if (currentLine.includes("six") || currentLine.includes("6")) return "6";
      if (currentLine.includes("seven") || currentLine.includes("7"))
        return "7";
      if (currentLine.includes("eight") || currentLine.includes("8"))
        return "8";
      if (currentLine.includes("nine") || currentLine.includes("9")) return "9";
    }
  });
  const lastDigits = lines.map((line) => {
    const lineByChars = line.split("").reverse();

    let currentLine = "";
    for (let i = 0; i < lineByChars.length; i++) {
      currentLine += lineByChars[i];
      if (currentLine.includes("eno") || currentLine.includes("1")) return "1";
      if (currentLine.includes("owt") || currentLine.includes("2")) return "2";
      if (currentLine.includes("eerht") || currentLine.includes("3"))
        return "3";
      if (currentLine.includes("ruof") || currentLine.includes("4")) return "4";
      if (currentLine.includes("evif") || currentLine.includes("5")) return "5";
      if (currentLine.includes("xis") || currentLine.includes("6")) return "6";
      if (currentLine.includes("neves") || currentLine.includes("7"))
        return "7";
      if (currentLine.includes("thgie") || currentLine.includes("8"))
        return "8";
      if (currentLine.includes("enin") || currentLine.includes("9")) return "9";
    }
  });

  const part2Results = firstDigits.map((digit, index) => {
    return parseInt(digit + lastDigits[index]);
  });

  console.log(
    "Part 2 Solution: ",
    part2Results.reduce((acc, curr) => acc + curr, 0)
  );
});
