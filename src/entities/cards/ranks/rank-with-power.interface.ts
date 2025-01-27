import type IRank from "./rank.interface";

export default interface WithPower extends IRank {
  isHigherThan(other: WithPower): boolean;
  isLowerThan(other: WithPower): boolean
}
