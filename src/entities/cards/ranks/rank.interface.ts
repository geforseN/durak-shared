import type { Rank } from "@durak-game/durak-dts";

export default interface IRank {
  isEqualTo(rank: IRank): boolean;
  toString(): Rank;
}
