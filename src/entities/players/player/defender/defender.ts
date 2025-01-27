import type { IDefender__ } from "@/entities/__types";

export default class Defender implements IDefender__ {
  get role() {
    return "Defender" as const;
  }

  isAllowed() {
    return false;
  }

  toJSON() {
    return {
      role: "Defender",
    };
  }
}
