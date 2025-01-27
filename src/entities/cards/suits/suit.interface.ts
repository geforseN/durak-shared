import type { Suit } from "@durak-game/durak-dts"

export default interface ISuit {
  isEqualTo(suit: ISuit): boolean
  toString(): Suit
}
