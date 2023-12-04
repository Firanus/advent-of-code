import path from "path";
import fs from "fs";

interface Card {
  id: number;
  winningNumbers: number[];
  ownedNumbers: number[];
  matchCount: number;
}

interface CardGroup {
  id: number;
  count: number;
}

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const cards: Card[] = data.split("\n").map((cardString) => {
      const cardId = parseInt(cardString.split(": ")[0].slice(4).trim(), 10);
      const [winningNumbers, ownedNumbers] = cardString
        .split(": ")[1]
        .split(" | ")
        .map((numString) => {
          return numString
            .split(" ")
            .filter(Boolean)
            .map((val) => parseInt(val.trim(), 10));
        });
      const matchCount = ownedNumbers.reduce((acc, curr) => {
        return acc + (winningNumbers.includes(curr) ? 1 : 0);
      }, 0);
      return {
        id: cardId,
        winningNumbers,
        ownedNumbers,
        matchCount,
      };
    });

    const cardPoints = cards.map((card) =>
      card.ownedNumbers.reduce((acc, curr) => {
        if (card.winningNumbers.includes(curr)) {
          return acc === 0 ? 1 : acc * 2;
        }
        return acc;
      }, 0)
    );

    console.log(
      "Part 1 Solution -",
      cardPoints.reduce((acc, curr) => acc + curr, 0)
    );

    const cardGroups: CardGroup[] = [
      ...cards.map((c) => ({ id: c.id, count: 1 })),
    ];
    for (let i = 0; i < cards.length; i++) {
      const currentCard = cards[i];
      const currentCardGroup = cardGroups.find(
        (cg) => cg.id === currentCard.id
      );
      for (let i = 0; i < currentCard.matchCount; i++) {
        const newCardId = currentCard.id + i + 1;
        const existingCardGroup = cardGroups.find((cg) => cg.id === newCardId);
        if (existingCardGroup) {
          existingCardGroup.count += currentCardGroup!.count;
        } else {
          throw new Error("Card group not found - this should never happen");
        }
      }
    }

    console.log(
      "Part 2 Solution -",
      cardGroups.map((cg) => cg.count).reduce((acc, curr) => acc + curr, 0)
    );
  }
);
