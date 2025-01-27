import { powers } from "@durak-game/durak-dts";
import type IWithPower from "./rank-with-power.interface";
import type IRank from "./rank.interface";

export default class WithPower implements IWithPower {
  readonly #power: number;

  static readonly #powers = powers;

  constructor(private readonly origin: IRank) {
    this.#power = WithPower.#powers[origin.toString()];
  }

  isHigherThan(other: WithPower) {
    return this.#power > other.#power;
  }

  isLowerThan(other: WithPower) {
    return this.#power < other.#power;
  }

  isEqualTo(other: IRank) {
    return this.origin.isEqualTo(other);
  }

  toString() {
    return this.origin.toString();
  }
}
