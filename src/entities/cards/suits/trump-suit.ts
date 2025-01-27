import type CanBeTrump from "./can-be-trump-suit.interface";
import type ISuit from "./suit.interface";

export default class TrumpSuit implements ISuit, CanBeTrump {
  constructor(private readonly origin: ISuit) {}

  isEqualTo(suit: ISuit): boolean {
    return this.origin.isEqualTo(suit);
  }

  toString() {
    return this.origin.toString();
  }

  isTrump() {
    return true;
  }
}
