import type {
  CanMakeDefenseMove,
  CanMakeTransferMove,
  IDefender__,
} from "@/entities/__types";

/** @summary should be used in Transferable Durak Game  */
export default class Uncertain
  implements IDefender__, CanMakeDefenseMove, CanMakeTransferMove
{
  get role() {
    return "Defender" as const;
  }

  perform(_move: object): never {
    throw new Error("Method not implemented.");
  }
}
