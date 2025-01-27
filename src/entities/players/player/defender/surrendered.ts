import type { IDefender__ } from "@/entities/__types";

export default class Surrendered implements IDefender__ {
  get role() {
    return "Defender" as const;
  }
}
