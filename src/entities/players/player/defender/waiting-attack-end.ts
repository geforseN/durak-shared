import { IDefender__ } from "@/entities/__types";

export default class WaitingAttackEnd implements IDefender__ {
  get role() {
    return "Defender" as const;
  }
}
