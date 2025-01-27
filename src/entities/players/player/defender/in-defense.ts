import type {
  CanMakeDefenseMove,
  CanMakeStopDefenseMove,
  IAllowed__,
  IDefender__,
} from "@/entities/__types";

export default class InDefense
  implements IDefender__, IAllowed__, CanMakeDefenseMove, CanMakeStopDefenseMove
{
  get role() {
    return "Defender" as const;
  }

  perform(_move: object): never {
    throw new Error("Method not implemented.");
  }
}
