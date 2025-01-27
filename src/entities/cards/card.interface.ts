import type { Rank, Suit } from "@durak-game/durak-dts";

export default interface ICard {
  isEqualTo(other: ICard): boolean;

  toString(): string;

  toJSON(): { rank: Rank; suit: Suit };
}
