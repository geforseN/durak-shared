import type { IAllowed__, IAttacker__, IDefender__ } from "../__types";

export class WithDefenderTurn {
  constructor(
    public readonly allowed: IDefender__ & IAllowed__,
    public readonly opponent: IAttacker__,
  ) {}
}
