import type {
  CanMakeAttackMove,
  CanMakeStopAttackMove,
  IAllowed__,
  IAttacker__,
} from "@/entities/__types";

export default class InAttack
  implements IAttacker__, IAllowed__, CanMakeAttackMove, CanMakeStopAttackMove
{
  get role() {
    return "Attacker" as const;
  }

  perform(_move: object): never {
    throw new Error("Method not implemented.");
  }
}
