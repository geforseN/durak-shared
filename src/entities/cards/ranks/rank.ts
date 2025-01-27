import type { Rank as RankValue } from "@durak-game/durak-dts";
import type IRank from "./rank.interface";

export default class Rank implements IRank {
  constructor(private readonly value: RankValue) {}

  isEqualTo(rank: IRank) {
    return this.toString() === rank.toString();
  }

  toString() {
    return this.value;
  }
}
