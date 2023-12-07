import path from "path";
import fs from "fs";

const cardValue = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
];
const handValue = [
  "Five of a Kind",
  "Four of a Kind",
  "Full House",
  "Three of a Kind",
  "Two Pair",
  "One Pair",
  "High Card",
];

interface Hand {
  cards: string[];
  bid: number;
  type: number; // index of handValue
}

const getHandType = (cards: string[]): number => {
  const cardCounts = cards.reduce((acc, curr) => {
    acc[curr] = acc[curr] ? acc[curr] + 1 : 1;
    return acc;
  }, {} as { [key: string]: number });

  const cardCountKeyValuesArray = Object.entries(cardCounts).sort(
    (a, b) => b[1] - a[1]
  );
  const jokerCount =
    cardCountKeyValuesArray.find(([key]) => key === "J")?.[1] || 0;

  const jokerlessCardCountKeyValuesArray = cardCountKeyValuesArray.filter(
    ([key]) => key !== "J"
  );

  if (jokerlessCardCountKeyValuesArray[0]) {
    jokerlessCardCountKeyValuesArray[0][1] =
      jokerlessCardCountKeyValuesArray[0][1] + jokerCount;
  } else {
    jokerlessCardCountKeyValuesArray[0] = ["J", jokerCount];
  }

  const cardCountValues = jokerlessCardCountKeyValuesArray.map(
    ([, value]) => value
  );
  const cardCountKeys = jokerlessCardCountKeyValuesArray.map(([key]) => key);

  const maxCount = Math.max(...cardCountValues);
  const minCount = Math.min(...cardCountValues);

  if (maxCount === 5) {
    return 0;
  } else if (maxCount === 4) {
    return 1;
  } else if (maxCount === 3 && minCount === 2) {
    return 2;
  } else if (maxCount === 3) {
    return 3;
  } else if (maxCount === 2 && cardCountKeys.length === 3) {
    return 4;
  } else if (maxCount === 2) {
    return 5;
  } else {
    return 6;
  }
};

const parseHand = (handString: string): Hand => {
  const [cardsString, bidString] = handString.split(" ");
  const cards = cardsString.split("");
  const bid = parseInt(bidString, 10);
  const type = getHandType(cards);
  return {
    cards,
    bid,
    type,
  };
};

const sortHands = (a: Hand, b: Hand): number => {
  if (a.type === b.type) {
    for (let i = 0; i < a.cards.length; i++) {
      if (a.cards[i] === b.cards[i]) {
        continue;
      }
      return cardValue.indexOf(a.cards[i]) - cardValue.indexOf(b.cards[i]);
    }
  }
  return a.type - b.type;
};

fs.readFile(
  path.resolve(__dirname, "./input.txt"),
  "utf8",
  async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const hands = data.split("\n").map(parseHand).sort(sortHands);

    const winnings = hands.reduce(
      (acc, curr, currIndex) => acc + curr.bid * (hands.length - currIndex),
      0
    );

    console.log("Part 2 Solution -", winnings);
  }
);
