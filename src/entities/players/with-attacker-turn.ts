import type { IAllowed__, IAttacker__, IDefender__ } from "../__types";

export class WithAttackerTurn {
  constructor(
    public readonly allowed: IAttacker__ & IAllowed__,
    public readonly opponent: IDefender__,
  ) {}
}
