import type {
  CanMakeAttackMove,
  IAllowed__,
  IAttacker__,
} from "@/entities/__types";

export default class FirstMove
  implements IAttacker__, IAllowed__, CanMakeAttackMove
{
  get role() {
    return "Attacker" as const;
  }

  perform(_move: object): never {
    throw new Error("Method not implemented.");
  }
}
