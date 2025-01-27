import type { IAttacker__ } from "@/entities/__types";

export default class Attacker implements IAttacker__ {
  get role() {
    return "Attacker" as const;
  }

  isAllowed() {
    return false;
  }

  toJSON() {
    return {
      kind: "Attacker",
    };
  }
}
