import type { IAttacker__ } from "@/entities/__types";

export default class WaitingDefenseEnd implements IAttacker__ {
  get role() {
    return "Attacker" as const;
  }
}
