import type { Suit as SuitValue } from "@durak-game/durak-dts";
import type ISuit from "./suit.interface";

export default class Suit implements ISuit {
  constructor(private readonly value: SuitValue) {}

  isEqualTo(suit: Suit) {
    return this.toString() === suit.toString();
  }

  toString() {
    return this.value;
  }
}
