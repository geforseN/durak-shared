import type ICard from "./card.interface";
import type WithPower from "./ranks/rank-with-power.interface";
import type CanBeTrump from "./suits/can-be-trump-suit.interface";

export default class GameCard implements ICard {
  constructor(
    public readonly rank: WithPower,
    public readonly suit: CanBeTrump,
    private readonly origin: ICard
  ) {}

  isTrump() {
    return this.suit.isTrump();
  }

  isPlain() {
    return !this.isTrump();
  }

  canBeat(other: GameCard) {
    const trumpCards = [this, other].filter((card) => card.suit.isTrump());
    if (trumpCards.length === 1) {
      return trumpCards.includes(this);
    }
    return this.rank.isHigherThan(other.rank);
  }

  isEqualTo(other: ICard) {
    return this.origin.isEqualTo(other);
  }

  toString() {
    return this.origin.toString();
  }

  get asString() {
    return this.toString();
  }

  toJSON() {
    return this.origin.toJSON();
  }
}
