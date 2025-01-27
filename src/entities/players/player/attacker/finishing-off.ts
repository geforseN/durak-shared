import type {
  CanMakeAttackMove,
  CanMakeStopAttackMove,
  IAllowed__,
  IAttacker__,
} from "@/entities/__types";

/** @summary should be used in Throw-in Durak Game  */
export default class FinishingOff
  implements IAttacker__, IAllowed__, CanMakeAttackMove, CanMakeStopAttackMove
{
  get role() {
    return "Attacker" as const;
  }

  perform(_move: object): never {
    throw new Error("Method not implemented.");
  }
}
