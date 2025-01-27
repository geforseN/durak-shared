import type ICard from "./card.interface";
import type IRank from "./ranks/rank.interface";
import type ISuit from "./suits/suit.interface";

export default class Card implements ICard {
  constructor(
    readonly rank: IRank,
    readonly suit: ISuit,
  ) {}

  isEqualTo(other: Card) {
    return this.rank.isEqualTo(other.rank) && this.suit.isEqualTo(other.suit);
  }

  toString() {
    return `${this.rank.toString()}${this.suit.toString()}`;
  }

  toJSON() {
    return {
      rank: this.rank.toString(),
      suit: this.suit.toString(),
    };
  }
}
