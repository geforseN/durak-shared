import { CardDTO, ranks } from "@durak-game/durak-dts";
import WithPower from "../src/entities/cards/ranks/rank-with-power";
import Rank from "../src/entities/cards/ranks/rank";
import GameCard from "../src/entities/cards/game-card";
import Card from "../src/entities/cards/card";
import { suits } from "@durak-game/durak-dts";
import TrumpSuit from "../src/entities/cards/suits/trump-suit";
import NonTrumpSuit from "../src/entities/cards/suits/non-trump-suit";

function randomInt(max: number): number;
// eslint-disable-next-line @typescript-eslint/unified-signatures
function randomInt(min: number, max: number): number;
function randomInt(...args: [max: number] | [min: number, max: number]) {
  const min = args.length === 1 ? 0 : Math.ceil(args[0]);
  let max = args[args.length === 1 ? 0 : 1];
  if (max == undefined) {
    throw new Error("Wrong args provided");
  }
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export default function setupCards() {
  const _ranks = Object.fromEntries(
    ranks.map((rank) => [rank, new WithPower(new Rank(rank))]),
  );

  const nonTrumpSuits = Object.fromEntries(
    suits.map((suit) => [suit, new NonTrumpSuit(suit)]),
  );

  const trumpSuits = Object.fromEntries(
    suits.map((suit) => [suit, new TrumpSuit(suit)]),
  );

  const ranksAsValues = Object.values(_ranks).flat();

  const nonTrumpCards = Object.fromEntries(
    Object.values(nonTrumpSuits)
      .flat()
      .flatMap((suit) =>
        ranksAsValues.map((rank) => [
          `${rank.toString()}${suit.toString()}`,
          new GameCard(rank, suit, new Card(rank, suit)),
        ]),
      ),
  );

  const trumpCards = Object.fromEntries(
    Object.values(trumpSuits)
      .flat()
      .flatMap((suit) =>
        ranksAsValues.map((rank) => [
          `${rank.toString()}${suit.toString()}`,
          new GameCard(rank, suit, new Card(rank, suit)),
        ]),
      ),
  );

  return {
    nonTrumpCards,
    trumpCards,
    any() {
      const cards = Math.random() > 0.5 ? trumpCards : nonTrumpCards;
      const rank = ranks[randomInt(ranks.length)];
      const suit = suits[randomInt(suits.length)];
      const card = cards[`${rank}${suit}`];
      return card;
    },
  };
}

// TODO: should refactor code that uses it, should use declarative methods
export const __cards__ = setupCards();

export class Cards<T extends GameCard = GameCard> {
  readonly #values: readonly T[];

  constructor(values: readonly T[]) {
    this.#values = values;
  }

  toArray() {
    return this.#values;
  }

  *[Symbol.iterator]() {
    yield* this.#values;
  }

  require(string: `${CardDTO["rank"]}${CardDTO["suit"]}`) {
    const card = this.#values.find((card) => card.toString() === string);
    if (!card) {
      throw new Error(`Failed to find card by string="${string}"`);
    }
    return card;
  }

  withSuit(suit: T["suit"]): Cards {
    return this.#withFilter((card) => card.suit.isEqualTo(suit));
  }

  withRankThatLowerThan(rank: T["rank"]) {
    return this.#withFilter((card) => card.rank.isLowerThan(rank));
  }

  withRankThatHigherThan(rank: T["rank"]) {
    return this.#withFilter((card) => card.rank.isHigherThan(rank));
  }

  #withFilter(
    predicate: (value: T, index: number, array: readonly T[]) => unknown,
  ) {
    return new Cards(this.#values.filter(predicate));
  }
}

export const allTrumpCards = Object.values(__cards__.trumpCards);

export const trumpCards = new Cards(allTrumpCards);

export const allNonTrumpCards = Object.values(__cards__.nonTrumpCards);

export const nonTrumpCards = new Cards(allNonTrumpCards);

export const sameSuitHigherRankFor = (cards: Cards) => (cardToTest: GameCard) =>
  cards
    .withSuit(cardToTest.suit)
    .withRankThatHigherThan(cardToTest.rank)
    .toArray();

export const sameSuitLowerRankFor = (cards: Cards) => (cardToTest: GameCard) =>
  cards
    .withSuit(cardToTest.suit)
    .withRankThatLowerThan(cardToTest.rank)
    .toArray();
