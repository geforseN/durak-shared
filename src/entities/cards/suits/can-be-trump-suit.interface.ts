import type ISuit from "./suit.interface";

export default interface CanBeTrump extends ISuit {
  isTrump(): boolean
}
